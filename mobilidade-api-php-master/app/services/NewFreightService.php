<?php

namespace app\services;

use app\constant\TripCallTypeConst;
use app\dao\AccessibilityAssistantDao;
use app\dao\AccessibilityDao;
use app\dao\AccessibilityObstacleDao;
use app\dao\CityDao;
use app\dao\CustomerDao;
use app\dao\DeliveryInfoDao;
use app\dao\DestinationDao;
use app\dao\DriverCommissionDao;
use app\dao\FreightInfoDao;
use app\dao\FreightItemDao;
use app\dao\LogDao;
use app\dao\OriginDao;
use app\dao\TripDao;
use app\dao\TripItemDao;
use app\dao\TripScheduledDao;
use app\dao\ZoneDao;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\exceptions\DriverCommissionException;
use app\exceptions\FreightException;
use app\model\Accessibility;
use app\model\AccessibilityAssistant;
use app\model\AccessibilityObstacle;
use app\model\DeliveryInfo;
use app\model\Destination;
use app\model\DriverCommission;
use app\model\FreightInfo;
use app\model\FreightItem;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\Origin;
use app\model\Trip;
use app\model\TripItem;
use app\model\TripScheduled;
use app\model\Zone;
use app\realtime\TripRealtime;
use app\utils\Connection;
use app\validator\FreightValidator;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/09/2019
 * Time: 14:45
 */
class NewFreightService
{
    private $validator;
    private $dao;
    private $conn;
    private $cityDao;
    private $driverCommissionDao;
    private $tripWayPointService;
    private $customerDao;
    private $tripPaymentService;
    private $customerTripCallService;
    private $minPriceRewardTripService;
    /**
     * @var Trip
     */
    private $trip;
    private $tripRealtime;
    private $accessibilityObstacleDao;
    private $accessibilityAssistantDao;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->validator = new FreightValidator;
        $this->dao = new TripDao;
        $this->cityDao = new CityDao;
        $this->driverCommissionDao = new DriverCommissionDao;
        $this->tripWayPointService = new TripWayPointService;
        $this->customerDao = new CustomerDao;
        $this->tripPaymentService = new CustomerTripPaymentService;
        $this->customerTripCallService = new CustomerTripCallService;
        $this->minPriceRewardTripService = new MinPriceRewardTripService;
        $this->tripRealtime = new TripRealtime;
        $this->accessibilityObstacleDao = new AccessibilityObstacleDao;
        $this->accessibilityAssistantDao = new AccessibilityAssistantDao;
    }

    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function new($request)
    {
        $this->validator->validateInsert($request);

        $this->conn->beginTransaction();

        try {
            $trip = $this->createTrip($request, $origin);

            if (isset($request->waypoints) && !empty($request->waypoints))
                $this->createWayPoints($request->waypoints, $trip->getTripReference());

            $this->tripPayment(
                $trip, $request->cardId ?? null, $request->mpToken ?? null);

            if (isset($request->accessibility))
                $this->createAccessibility($request->accessibility, $trip->getTripReference());

            if (isset($request->items))
                $this->createFreightItems($trip, $request->items);

            if (isset($request->deliveryInfo))
                $this->createDeliveryInfo($trip->getTripReference(), $request->deliveryInfo);

            if (isset($request->freightInfo))
                $this->createFreightInfo($trip->getTripReference(), $request->freightInfo);

            if (isset($request->tripItems))
                $this->createTripItems($trip->getTripReference(), $request->tripItems);

            $this->customerTripCallService
                ->callDrivers($trip, $origin);

            $this->minPriceRewardTripService
                ->generate($trip);

            $trip = $this->dao
                ->find($trip->getTripReference());

            $logData = (object)[
                'trip' => $trip,
            ];

            $this->createLog(
                $logData,
                $trip->tripReference,
                $trip->userId,
                "VIAGEM INSERIDA",
                LogCriticalType::AVISO
            );

            $this->tripRealtime
                ->hydrate($trip)
                ->createTrip();

            $this->conn->commit();

            exec(
                "nohup php ../console/command.php trip-call {$this->trip->getTripReference()} > /dev/null 2>&1 & echo $! ");

        } catch (CheckoutCardException $e) {
            $this->updateTripOnPaymentRefused($this->trip);
            $this->conn->rollBack();
            (new LogDao)->logException($e);
            throw $e;

        } catch (CheckoutServiceException $e) {
            $this->updateTripOnPaymentRefused($this->trip);
            $this->conn->rollBack();
            (new LogDao)->logException($e);
            throw $e;

        } catch (Exception $e) {
            $this->conn->rollBack();
            (new LogDao)->logException($e);
            throw $e;
        }

        return $trip;
    }

    private function createDeliveryInfo($tripReference, $data)
    {
        $deliveryInfo = new DeliveryInfo($data);
        $deliveryInfo
            ->setTripReference($tripReference)
            ->setId(
                (new DeliveryInfoDao)
                    ->sqlInsert($deliveryInfo)
            );

        return $deliveryInfo;
    }

    private function createFreightInfo($tripReference, $data)
    {
        $freightInfo = new FreightInfo($data);
        $freightInfo->setTripReference($tripReference)
            ->setId(
                (new FreightInfoDao)
                    ->sqlInsert($freightInfo)
            );

        return $freightInfo;
    }

    private function createTripItems($tripReference, array $data)
    {
        foreach ($data as $value) {
            $item = new TripItem($value);
            $item
                ->setTripReference($tripReference)
                ->setId(
                    (new TripItemDao)
                        ->sqlInsert($item)
                );
        }
    }

    /**
     * @param $request
     * @param null|Origin $origin
     * @return Trip
     * @throws FreightException
     * @throws DriverCommissionException
     * @throws Exception
     */
    private function createTrip($request, ?Origin &$origin = null): Trip
    {
        $origin = $this->createOrigin($request->origin);
        $destination = $this->createDestination($request->destination);
        $driverCommission = $this->findDriverCommission($origin->getCityId(), $request->tripTypeId);
        $zone = $this->findZone($origin);

        $data = $request;
        $data->cityId = $origin->getCityId();
        $data->originId = $origin->getIdOrigin();
        $data->destinationId = $destination->getIdDestination();
        $data->driverCommissionId = $driverCommission->getIdDriverCommission();
        $data->zoneId = $zone ? $zone->getIdZone() : null;
        $data->date = now();
        $data->estimatedTripTime = isset($request->estimatedTripTime) ?
            round($request->estimatedTripTime * 60) : null;
        $data->isCalling = true;
        $data->tripCallTypeId = TripCallTypeConst::FREIGHT;
        $data->status = isset($request->schedule) && !empty($request->schedule) ?
            Trip::SCHEDULED : Trip::SEARCHING;

        /** @var Trip $trip */
        $trip = $this->dao->create($data);

        $trip->setTripReference(
            $this->dao
                ->findSimpleById($trip->getIdTrip())
                ->tripReference);

        if ($trip->getStatus() == Trip::SCHEDULED)
            $this->scheduleTrip($trip->getTripReference(), $request->schedule, $data->scheduleISO ?? null);

        return $trip;
    }

    /**
     * @param $tripReference
     * @param $schedule
     * @param null $scheduleISO
     * @return \app\model\TripScheduled
     * @throws Exception
     */
    private function scheduleTrip($tripReference, $schedule, $scheduleISO = null)
    {
        $nowUTC = gmdate('Y-m-d H:i:s', strtotime(now())) . ".000Z";

        if ($scheduleISO) {
            if (dateIsBefore($scheduleISO, $nowUTC))
                throw new Exception("Data do agendamento não pode ser menor que o horário atual");
        } else {
            if (dateIsBefore($schedule, now()))
                throw new Exception("Data do agendamento não pode ser menor que o horário atual");
        }

        $tripScheduled = new TripScheduled;
        $tripScheduled
            ->setTripReference($tripReference)
            ->setScheduleUTC($scheduleISO ? gmdate('Y-m-d H:i:s', strtotime($scheduleISO)) : null)
            ->setSchedule($schedule)
            ->setId(
                (new TripScheduledDao)->sqlInsert($tripScheduled)
            );

        return $tripScheduled;
    }

    /**
     * @param $data
     * @return \app\model\Origin
     * @throws FreightException
     */
    private function createOrigin($data): Origin
    {
        /** @var Origin $origin */
        $origin = new Origin($data);

        $city = $this->cityDao
            ->findByCoordinate($data->latitude, $data->longitude);

        if (!$city)
            throw new FreightException(1630, $data);

        $origin
            ->setCityId($city->id)
            ->setIdOrigin(
                (new OriginDao)
                    ->sqlInsert($origin)
            );

        return $origin;
    }

    private function createDestination($data): Destination
    {
        $data->cityId = (!isset($data->cityId) || empty($data->cityId))
            ? null : $data->cityId;

        /** @var Destination $destination */
        $destination = (new DestinationDao)->create($data);

        return $destination;
    }

    /**
     * @param $cityId
     * @param $tripTypeId
     * @return DriverCommission
     * @throws DriverCommissionException
     */
    private function findDriverCommission($cityId, $tripTypeId): DriverCommission
    {
        $driverCommission = $this->driverCommissionDao
            ->findByCityAndTripType($cityId, $tripTypeId);

        if (!$driverCommission)
            throw new DriverCommissionException(
                1350, compact('cityId', 'tripTypeId'));

        return new DriverCommission($driverCommission);
    }

    /**
     * @param \app\model\Origin $origin
     * @return null|\app\model\Zone
     */
    private function findZone(Origin $origin): ?Zone
    {
        $zone = (new ZoneDao)
            ->findFromOrigin($origin);

        return $zone ? new Zone($zone) : null;
    }

    /**
     * @param $wayPoints
     * @param $tripReference
     * @return array|mixed
     */
    private function createWayPoints($wayPoints, $tripReference)
    {
        $tripWayPoints = $this->tripWayPointService
            ->insertMany($wayPoints, $tripReference);

        return $tripWayPoints;
    }

    /**
     * @param Trip $trip
     * @param $cardId
     * @param $mpToken
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     * @throws Exception
     */
    private function tripPayment(Trip $trip, $cardId, $mpToken)
    {
        $this->trip = $trip;

        $customer = $this->customerDao->findByUser($trip->getUserId());

        $this->tripPaymentService->tripPayment($customer, $trip, $cardId, $mpToken);
    }

    /**
     * @param \app\model\Trip $trip
     * @throws Exception
     */
    private function updateTripOnPaymentRefused(Trip $trip)
    {
        return $this->dao
            ->cancelByCustomer(
                $trip->getTripReference(),
                now(),
                Trip::PAYMENT_REFUSED
            );
    }

    private function createAccessibility($accessibilityRequest, $tripReference)
    {
        $accessibility = new Accessibility;
        $accessibility
            ->setTripReference($tripReference)
            ->setId(
                (new AccessibilityDao)->sqlInsert($accessibility)
            );

        foreach ($accessibilityRequest->obstacle as $obstacle) {
            $accessibilityObstacle = new AccessibilityObstacle;
            $accessibilityObstacle
                ->setAccessibilityId($accessibility->getId())
                ->setActionId($obstacle->actionId)
                ->setObstacleOnFloorId($obstacle->obstacleOnFloorId);

            if (isset($accessibilityRequest->obstacle->numberFloor))
                $accessibilityObstacle
                    ->setNumberFloor(
                        $accessibilityRequest->obstacle->numberFloor);

            $accessibilityObstacle
                ->setId(
                    $this->accessibilityObstacleDao
                        ->sqlInsert($accessibilityObstacle));
        }

        foreach ($accessibilityRequest->assistant as $assistant) {
            $accessibilityHelp = new AccessibilityAssistant;
            $accessibilityHelp
                ->setAccessibilityId($accessibility->getId())
                ->setActionId($assistant->actionId)
                ->setHelpId($assistant->helpId)
                ->setQuantity($accessibilityRequest->quantity ?? 1)
                ->setId(
                    $this->accessibilityAssistantDao
                        ->sqlInsert($accessibilityHelp));
        }
    }

    private function createFreightItems(Trip $trip, $items)
    {
        $freightItemDao = new FreightItemDao;

        foreach ($items as $item) {
            $freightItem = new FreightItem;
            $freightItem
                ->setTripReference($trip->getTripReference())
                ->setQuantity($item->quantity)
                ->setItemId($item->itemId)
                ->setId(
                    $freightItemDao
                        ->sqlInsert($freightItem));
        }
    }

    /**
     * @param $data
     * @param $idReference
     * @param $userId
     * @param $message
     * @param string $level
     * @return bool
     * @throws Exception
     */
    private function createLog($data, $idReference, $userId, $message, $level = LogCriticalType::INFORMACAO): bool
    {
        $log = new Log(LogType::PROCESS, $level);
        $log->setData($data)
            ->setIdReference($idReference)
            ->setUserId($userId)
            ->setApp(LogApp::DRIVER)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }
}