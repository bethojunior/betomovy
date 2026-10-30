<?php

namespace app\services;

use app\constant\PartnerRegisterStatusConst;
use app\constant\RecalculatedTripTypeConst;
use app\constant\TripCallTypeConst;
use app\dao\CashbackDao;
use app\dao\DeliveryInfoDao;
use app\dao\DestinationDao;
use app\dao\DriverDao;
use app\dao\LogDao;
use app\dao\OriginDao;
use app\dao\PartnerDao;
use app\dao\RecalculatedTripDao;
use app\dao\TripCashbackDao;
use app\dao\TripConfigAreaDao;
use app\dao\TripCustomerDao;
use app\dao\TripDao;
use app\dao\TripItemDao;
use app\dao\TripTypeDao;
use app\exceptions\CheckoutCardException;
use app\exceptions\DriverException;
use app\exceptions\PartnerException;
use app\exceptions\RecalculatedTripException;
use app\model\DeliveryInfo;
use app\model\Destination;
use app\model\Driver;
use app\model\DriverRegisterStatus;
use app\model\Location;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\Origin;
use app\model\RecalculatedTrip;
use app\model\Trip;
use app\model\TripCashback;
use app\model\TripCustomer;
use app\model\TripItem;
use app\queue\Jobs\MobilityLiteJob;
use app\queue\Queue;
use app\realtime\TripRealtime;
use app\utils\Connection;
use app\utils\Headers;
use app\validator\TripValidator;
use Exception;
use PDO;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/05/2019
 * Time: 08:58
 */
class PartnerTripService
{
    /** @var Trip|null $trip */
    private $trip;
    /** @var PDO $conn */
    private $conn;
    private $tripDao;
    private $tripValidator;
    private $tripCustomerDao;
    private $tripConfigAreaDao;
    private $tripWayPointService;
    private $tripPaymentService;
    private $partnerDao;
    private $minPriceRewardTripService;
    private $tripCallService;
    private $recalculatedTripDao;

    public function __construct()
    {
        $this->tripDao = new TripDao;
        $this->tripValidator = new TripValidator;
        $this->tripCustomerDao = new TripCustomerDao;
        $this->tripConfigAreaDao = new TripConfigAreaDao;
        $this->tripWayPointService = new TripWayPointService;
        $this->tripPaymentService = new PartnerTripPaymentService;
        $this->tripCallService = new CustomerTripCallService;
        $this->minPriceRewardTripService = new MinPriceRewardTripService;
        $this->partnerDao = new PartnerDao;
        $this->recalculatedTripDao = new RecalculatedTripDao;
        $this->conn = Connection::open();
    }

    /**
     * @param $request
     * @return stdClass
     * @throws Exception
     */
    public function newTrip($request)
    {
        $this->validateNewTripAndFindPartner($request, $partner);

        $this->conn->beginTransaction();

        try {
            $this->trip = $this->createTrip($request, $origin);

            $currentWaypoints = $this->createWayPoints($request->waypoints ?? null, $this->trip->getTripReference());

            $this->createDeliveryInfo($this->trip->getTripReference(), $request->deliveryInfo ?? null);

            $this->createTripItems($this->trip->getTripReference(), $request->tripItems ?? []);

            $this->tripPayment($partner, $data->cardId ?? null, $data->mpToken ?? null);

            $tripType = (new TripTypeDao)
                ->find($request->tripTypeId);

            $result = $this->tripCallService
                ->callDrivers($this->trip, $origin);

            $this->minPriceRewardTripService->generate($this->trip);

            /** @var stdClass $trip */
            $trip = $this->tripDao->find($this->trip->getTripReference());

            $tripParamsMobilityLite = [
                'appName' => env('APP_NAME'),
                'tripReference' => $trip->tripReference,
                'price' => floatval($trip->price),
                'distance' => floatval($request->distance),
                'tripTime' => floatval($request->estimatedTripTime),
                'drivers' => $result['resultDrivers'],

                'origin' => [
                    'latitude' => $request->origin->latitude,
                    'longitude' => $request->origin->longitude,
                    'address' => $request->origin->address,
                ],

                'destination' => [
                    'latitude' => $request->destination->latitude,
                    'longitude' => $request->destination->longitude,
                    'address' => $request->destination->address,
                ],

                'tripWayPoints' => $currentWaypoints ?? [],

                'customer' => [
                    'name' => $request->tripCustomer->name,
                    'phone' => $request->tripCustomer->phone ?? ''
                ]
            ];

            Queue::dispatch(MobilityLiteJob::class, ['trip' => $tripParamsMobilityLite]);

            $logData = (object)[
                'drivers' => $result['resultDrivers'],
                'customer' => $request->tripCustomer ?? $partner,
                'trip' => $trip,
                'partner' => $partner
            ];

            $this->createLog(
                $logData,
                $trip->tripReference,
                $trip->userId,
                "VIAGEM INSERIDA POR PARCEIRO",
                LogCriticalType::AVISO
            );

            $this->conn->commit();

            (new TripRealtime)
                ->hydrate($trip)
                ->createTrip();

            try {
                $this->tripCallService->notifyFoundDrivers(
                    $this->trip,
                    is_array($result['resultDrivers'] ?? null) ? $result['resultDrivers'] : []
                );
            } catch (\Throwable $pushError) {
                (new LogDao())->logException($pushError);
            }

            backgroundTask('trip-call', escapeshellarg($this->trip->getTripReference()));

            if (
                empty($result['resultDrivers']) &&
                !$this->trip->getDriverId() &&
                !in_array($this->trip->getStatus(), [Trip::STAND_BY, Trip::SCHEDULED])
            )
                throw new Exception($tripType->messageNoDriversFound);
        } catch (CheckoutCardException $e) {

            $this->updateTripOnPaymentRefused();
            $this->conn->commit();

            (new LogDao)->logException($e);
            throw $e;
        } catch (Exception $e) {

            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            (new LogDao)->logException($e);
            throw $e;
        }

        return $trip;
    }

    private function createTripItems($tripReference, array $data = [])
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

    private function createDeliveryInfo($tripReference, $data)
    {
        if (empty($data))
            return null;

        $deliveryInfo = new DeliveryInfo($data);
        $deliveryInfo
            ->setTripReference($tripReference)
            ->setId(
                (new DeliveryInfoDao)
                    ->sqlInsert($deliveryInfo)
            );

        return $deliveryInfo;
    }

    /**
     * @param $request
     * @param $partner
     * @throws PartnerException
     * @throws Exception
     */
    private function validateNewTripAndFindPartner($request, &$partner)
    {
        $partner = $this->partnerDao
            ->findByUser(Headers::getUserId());

        if (!$partner)
            throw new PartnerException(302);

        if ($partner->partnerRegisterStatusId != PartnerRegisterStatusConst::ACTIVE)
            throw new PartnerException(303);

        $this->tripValidator->validateNewTrip($request, false, true);
    }

    /**
     * @param $data
     * @param null|Origin $origin
     * @return \app\model\Trip
     * @throws Exception
     */
    private function createTrip($data, ?Origin &$origin): Trip
    {
        if (isset($data->estimatedTripTime)) {
            if (is_string($data->estimatedTripTime)) {
                if (preg_match('/([0-9]+(?:\.[0-9]+)?)/', str_replace(',', '.', $data->estimatedTripTime), $matches)) {
                    $data->estimatedTripTime = (float)$matches[1];
                } else {
                    $data->estimatedTripTime = 0.0;
                }
            } else {
                $data->estimatedTripTime = (float)$data->estimatedTripTime;
            }
        }
        if (isset($data->distance)) {
            if (is_string($data->distance)) {
                if (preg_match('/([0-9]+(?:\.[0-9]+)?)/', str_replace(',', '.', $data->distance), $matches)) {
                    $data->distance = (float)$matches[1];
                } else {
                    $data->distance = 0.0;
                }
            } else {
                $data->distance = (float)$data->distance;
            }
        }

        $data->destinationId = $this->createDestination($data)->getIdDestination();
        $origin = $this->createOrigin($data);

        $isNoDestination = $data->noDestination;

        /** @var TripCustomer $tripCustomer */
        $tripCustomer = $this->tripCustomerDao
            ->create($data->tripCustomer);

        $config = $this->tripConfigAreaDao
            ->getByOriginArea(
                new Location($origin->toStdClass()),
                Headers::getUserId(),
                $data->tripTypeId
            );

        $data->driverCommissionId = $config->idDriverCommission;
        $data->zoneId = $config->idZone;
        $data->partnerCommissionId = $config->partnerCommissionId;
        $data->originId = $origin->getIdOrigin();
        $data->cityId = $config->cityId;
        $data->tripCustomerId = $tripCustomer->getId();
        $data->tripCallTypeId = $isNoDestination ? TripCallTypeConst::TAXIMETER : TripCallTypeConst::PARCEIRO;
        $data->userId = Headers::getUserId();

        if (isset($data->ticketTrip) && $data->ticketTrip == true) {
            $data->status = isset($data->driverId) ? Trip::ACCEPTED : Trip::STAND_BY;
            $data->tripCallTypeId = TripCallTypeConst::TICKET;
        }

        if (isset($data->driverId)) {
            $driver = (new DriverDao)->find($data->driverId);
            $this->verifyDriverForTicketTrip(new Driver($driver));

            $data->driverId = $driver->idDriver;
            (new DriverDao)->putInTripAndRemoveCustomerRefused($data->driverId);
        }

        if (!empty($data->favorites))
            $this->mountFavorites($data);

        $data->date = now();

        /** @var \app\model\Trip $trip */
        $trip = $this->tripDao->create($data);

        $trip->setTripReference(
            $this->tripDao
                ->sqlSelect(
                    ['tripReference'],
                    [['idTrip', '=', $trip->getIdTrip()]]
                )
                ->get(false)->tripReference
        );

        if (isset($data->cashback->id) && isset($data->cashback->cashbackValue))
            $this->generateTripCashback($data->cashback->id, $data->cashback->cashbackValue, $trip);

        if (isset($data->recalculatedTrip)) {
            $recalculatedTrip = $this
                ->createRecalculatedTrip($data->recalculatedTrip, $trip->getTripReference());
            $trip
                ->setPrice($recalculatedTrip->getNewPrice());
        }

        return $trip;
    }

    /**
     * @param \app\model\Driver $driver
     * @throws Exception
     */
    private function verifyDriverForTicketTrip(Driver $driver)
    {
        if (
            $driver->getStatus() == Driver::OFF ||
            (!(bool)$driver->getPreAvailable() && $driver->getStatus() == Driver::IN_TRIP)
        )
            throw new DriverException(511, $driver->toStdClass());

        if ($driver->getDriverRegisterStatusId() != DriverRegisterStatus::ATIVO)
            throw new DriverException(512, $driver->toStdClass());
    }

    /**
     * @param $partner
     * Quando um pagamento é feito com cartão de crédito deve mandar
     * o ID do cartão
     * @param null $cardId
     * @param null $mpToken
     * @throws Exception
     * @throws CheckoutCardException
     */
    private function tripPayment(&$partner, $cardId = null, $mpToken = null)
    {
        if (!$this->trip->getTripPaymentFormId())
            throw new Exception("Forma de pagamento não informada");

        $this->tripPaymentService->tripPayment($partner, $this->trip, $cardId, $mpToken);
    }

    /**
     * @param $data
     * @return Destination
     */
    private function createDestination($data): Destination
    {
        /** @var Destination $destination */
        $destination = (new DestinationDao)
            ->create($data->destination);

        return $destination;
    }

    /**
     * @param $data
     * @return Origin
     * @throws Exception
     */
    private function createOrigin($data): Origin
    {
        /** @var \app\model\Origin $origin */
        $origin = (new OriginDao)
            ->create($data->origin);

        return $origin;
    }

    /**
     * @param $data
     */
    private function mountFavorites(&$data)
    {
        $data->favoriteDrivers = implode(',', (array)$data->favorites);
    }

    /**
     * @param $wayPoints
     * @param $tripReference
     * @return array|null
     */
    private function createWayPoints($wayPoints, $tripReference): ?array
    {
        if (empty($wayPoints))
            return null;

        $tripWayPoints = $this->tripWayPointService
            ->insertMany($wayPoints, $tripReference);

        return $tripWayPoints;
    }

    /**
     * @throws Exception
     */
    private function updateTripOnPaymentRefused()
    {
        $this->tripDao
            ->cancelByCustomer(
                $this->trip->getTripReference(),
                now(),
                Trip::PAYMENT_REFUSED
            );
    }

    /**
     * @param $data
     * @param $tripReference
     * @return RecalculatedTrip
     * @throws Exception
     */
    private function createRecalculatedTrip($data, $tripReference)
    {
        if ($data->oldPrice > $data->newPrice)
            throw new RecalculatedTripException(1600);

        $recalculatedTrip = new RecalculatedTrip;
        $recalculatedTrip
            ->setTripReference($tripReference)
            ->setNewPrice($data->newPrice)
            ->setOldPrice($data->oldPrice)
            ->setRecalculatedTripTypeId(RecalculatedTripTypeConst::PARTNER_UPDATE)
            ->setId(
                $this->recalculatedTripDao
                    ->sqlInsert($recalculatedTrip)
            );

        $this->tripDao
            ->updatePrice($tripReference, $recalculatedTrip->getNewPrice());

        return $recalculatedTrip;
    }

    /**
     * @param $cashbackId
     * @param $cashbackValue
     * @param \app\model\Trip $trip
     */
    private function generateTripCashback($cashbackId, $cashbackValue, Trip $trip)
    {
        if ((new CashbackDao)->findActive($cashbackId)) {
            $tripCashback = new TripCashback;
            $tripCashback
                ->setTripReference($trip->getTripReference())
                ->setUserId($trip->getUserId())
                ->setCashbackId($cashbackId)
                ->setValue($cashbackValue)
                ->setId(
                    (new TripCashbackDao)
                        ->sqlInsert($tripCashback)
                );
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
