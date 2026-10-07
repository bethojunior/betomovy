<?php

namespace app\services;

use app\constant\KnobTripConst;
use app\constant\TripCallTypeConst;
use app\dao\CityDao;
use app\dao\DestinationDao;
use app\dao\DriverDao;
use app\dao\DynamicAreaDao;
use app\dao\KnobTripDao;
use app\dao\LogDao;
use app\dao\OriginDao;
use app\dao\TripCustomerDao;
use app\dao\TripDao;
use app\dao\TripHistoryDao;
use app\dao\TripPaymentFormDao;
use app\dao\ZoneDao;
use app\exceptions\CheckoutServiceException;
use app\exceptions\DriverException;
use app\exceptions\PushException;
use app\exceptions\TripException;
use app\model\Config;
use app\model\Destination;
use app\model\Driver;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\Origin;
use app\model\Status;
use app\model\Trip;
use app\model\Zone;
use app\realtime\TripRealtime;
use app\utils\Connection;
use app\utils\Headers;
use app\utils\Push;
use app\validator\TripValidator;
use Exception;
use PDO;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/02/2019
 * Time: 15:04
 */
class KnobTripService
{
    /** @var PDO $conn */
    private $conn;
    private $dao;
    private $tripValidator;
    private $driverCommissionService;
    private $zoneDao;
    private $push;
    private $driverDao;
    private $tripWayPointService;
    private $tripDao;
    private $tripRealtime;
    private $minPriceRewardTripService;
    private $cityDao;
    private $tripCustomerDao;
    private $dynamicAreaDao;
    private $negativeBalanceLimitService;

    /**
     * KnobTripService constructor.
     * @throws CheckoutServiceException
     */
    public function __construct()
    {
        $this->conn = Connection::open();
        $this->dao = new KnobTripDao;
        $this->tripDao = new TripDao;
        $this->tripValidator = new TripValidator;
        $this->driverCommissionService = new DriverCommissionService;
        $this->zoneDao = new ZoneDao;
        $this->tripCustomerDao = new TripCustomerDao;
        $this->tripWayPointService = new TripWayPointService;
        $this->minPriceRewardTripService = new MinPriceRewardTripService;
        $this->driverDao = new DriverDao;
        $this->push = new Push;
        $this->tripRealtime = new TripRealtime;
        $this->cityDao = new CityDao;
        $this->dynamicAreaDao = new DynamicAreaDao;
        $this->negativeBalanceLimitService = new NegativeBalanceLimitService;
    }

    /**
     * @param $request
     * @return stdClass
     * @throws Exception
     */
    public function init($request)
    {
        // dd($request);

        $this->tripValidator->validateNewKnobTrip($request);

        $this->tripPaymentFormIsValid($request->tripPaymentFormId);

        if (!empty($request->waypoints) && isset($request->origin->latitude, $request->origin->longitude)) {
            $city = $this->cityDao->findByCoordinate(
                $request->origin->latitude,
                $request->origin->longitude
            );
            $cityId = $city->id ?? null;
            $this->tripValidator->waypointsLimitIsValid($request->waypoints, $cityId);
        }

        try {
            $this->conn->beginTransaction();

            $trip = $this->createTrip($request);

            if (!empty($request->waypoints))
                $this->createWayPoints($request->waypoints, $trip->getTripReference());

            $driver = $this->putDriverInTrip($trip->getDriverId());

            (new TripHistoryDao())->insertTripsFound([$trip], $driver->idDriver);

            $tripGeneric = $this->tripDao->find($trip->getTripReference());

            $this->minPriceRewardTripService->generate($trip);

            $this->tripRealtime
                ->hydrate($tripGeneric)
                ->createTrip();

            $logData = (object)[
                'trip' => $trip->toStdClass(),
                'driver' => $driver
            ];

            $this->createLog(
                $logData,
                $trip->getTripReference(),
                Headers::getUserId(),
                "VIAGEM DE MAÇANETA INSERIDA",
                LogCriticalType::AVISO
            );

            $this->conn->commit();

            return $tripGeneric;

        } catch (Exception $e) {

            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            if (isset($trip) && $trip instanceof Trip)
                $this->tripRealtime
                    ->setTripReference($trip->getTripReference())
                    ->deleteTrip();

            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $data
     * @return \app\model\Trip
     * @throws Exception
     */
    private function createTrip($data): Trip
    {
        $dynamicArea = $this->dynamicAreaDao->findByPosition($data->origin->latitude, $data->origin->longitude, date('H:i:s'));

        if ($dynamicArea) {
            $multiplierDynamicPrice = (float)$dynamicArea->multiplierValue;
        }

        $this->dao->verifyCustomerInTrip($data);

        $data->destinationId = $this->createDestination($data->destination)->getIdDestination();
        $origin = $this->createOrigin($data->origin);
        $data->originId = $origin->getIdOrigin();

        $data->cityId = $origin->getCityId();

        if (isset($data->tripCustomer))
            $this->createTripCustomer($data);

        $data->driverCommissionId = $this->driverCommissionService
            ->findCommissionId($data->cityId, $data->tripTypeId, $origin);

        $data->zoneId = $this->mountZone($data->cityId)->getIdZone();
        $data->date = now();
        $data->tripCallTypeId = TripCallTypeConst::MACANETA;
        $data->status = Trip::BOARDING;
        $data->multiplierDynamic = $multiplierDynamicPrice ?? $data->multiplierDynamic;

        /** @var \app\model\Trip $trip */
        $trip = $this->dao->create($data, Trip::class);

        $trip->setTripReference(
            $this->dao->sqlSelect(['tripReference'], [['idTrip', '=', $trip->getIdTrip()]]
            )
                ->get(false)->tripReference);

        return $trip;
    }

    private function createTripCustomer(&$data)
    {
        /** @var \app\model\TripCustomer $tripCustomer */
        $tripCustomer = $this->tripCustomerDao
            ->create($data->tripCustomer);

        $data
            ->tripCustomerId = $tripCustomer->getId();
    }

    /**
     * @param $data
     * @return Destination
     */
    private function createDestination($data): Destination
    {
        $data->cityId = (!isset($data->cityId) || empty($data->cityId))
            ? null : $data->cityId;

        /** @var Destination $destination */
        $destination = (new DestinationDao)
            ->create($data);

        return $destination;
    }

    /**
     * @param $data
     * @return \app\model\Origin
     */
    private function createOrigin($data): Origin
    {
        /** @var Origin $origin */
        $origin = (new OriginDao)
            ->create($data);

        $city = $this->cityDao
            ->findByCoordinate(
                $origin->getLatitude(), $origin->getLongitude());

        if (isset($city->id))
            $origin
                ->setCityId($city->id);

        return $origin;
    }

    /**
     * @param $wayPoints
     * @param $tripReference
     * @return array
     */
    private function createWayPoints($wayPoints, $tripReference): array
    {
        $tripWayPoints = $this->tripWayPointService
            ->insertMany($wayPoints, $tripReference);

        return $tripWayPoints;
    }

    /**
     * @param $cityId
     * @return \app\model\Zone
     */
    private function mountZone($cityId): Zone
    {
        return new Zone(
            $this->zoneDao
                ->findFirstFromCity($cityId)
        );
    }

    /**
     * @param $tripPaymentFormId
     * @throws Exception
     */
    private function tripPaymentFormIsValid($tripPaymentFormId)
    {
        $tripPaymentForm = (new TripPaymentFormDao)
            ->find($tripPaymentFormId);

        if ($tripPaymentForm->statusId == Status::EXCLUIDO)
            throw new Exception("Forma de pagamento está desabilitada, tenta outra forma");

        if (!in_array((int)$tripPaymentForm->paymentFormTypeId, KnobTripConst::PAYMENT_FORMS_TYPE_ACCEPTED))
            throw new TripException(207);
    }

    /**
     * @param $deviceToken
     * @return mixed
     * @throws PushException
     */
    private function notifyDriver($deviceToken)
    {
        $this->push
            ->setTitle("VIAGEM DE MAÇANETA")
            ->setBody("UM PASSAGEIRO SOLICITOU UMA VIAGEM DE MAÇANETA, ACEITE PARA EMBARCAR PASSAGEIRO")
            ->setDeviceToken($deviceToken);

        return $this->push
            ->sendNotification();
    }

    /**
     * @param $driverId
     * @return array|mixed
     * @throws Exception
     */
    private function putDriverInTrip($driverId)
    {
        $driver = $this->driverDao
            ->find($driverId, false, true);

        $this->validateDriver($driver);

        $this->driverDao
            ->putInTripAndRemoveCustomerRefused($driverId);

        $this->notifyDriver($driver->deviceToken);

        return $driver;
    }

    /**
     * @param $driver
     * @throws DriverException
     */
    private function validateDriver($driver)
    {
        if (!$driver)
            throw new DriverException(502);

        if ($driver->status == Driver::IN_TRIP ||
            $driver->status == Driver::OFF) {
            throw new DriverException(503);
        }

        $callDriverWithoutCredit = Config::get('call_driver_without_credit');
        $maxNegativeAmount = $this->negativeBalanceLimitService->getByCityId($driver->cityId ?? null);

        if ($callDriverWithoutCredit == 1 && $driver->prepaid == 1) {
            if ((float)$driver->balance->balance <= 0) {
                throw new DriverException(513);
            }
        }

        if (
            $callDriverWithoutCredit == 0 &&
            (float)$driver->balance->balance < (float)-$maxNegativeAmount
        ) {
            throw new DriverException(513);
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
            ->setApp(LogApp::CUSTOMER)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }
}