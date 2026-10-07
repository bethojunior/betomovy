<?php

namespace app\services;

use app\constant\PaymentFormTypeConst;
use app\constant\TripCallTypeConst;
use app\dao\CityDao;
use app\dao\DestinationDao;
use app\dao\DriverCommissionDao;
use app\dao\DriverDao;
use app\dao\LogDao;
use app\dao\OriginDao;
use app\dao\PriceDao;
use app\dao\TripDao;
use app\dao\TripHistoryDao;
use app\dao\TripPaymentFormDao;
use app\exceptions\DriverCommissionException;
use app\exceptions\DriverException;
use app\exceptions\PriceException;
use app\model\Config;
use app\model\Destination;
use app\model\Driver;
use app\model\DriverCommission;
use app\model\Log;
use app\model\LogType;
use app\model\Origin;
use app\model\Trip;
use app\realtime\TripRealtime;
use app\utils\Connection;
use app\utils\GeocodingService;
use app\utils\Headers;
use app\validator\TaximeterTripValidator;
use Exception;
use PDO;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/06/2020
 * Time: 14:14
 */
class TaximeterTripService
{
    /**
     * @var TaximeterTripValidator
     */
    private $validator;
    /**
     * @var TripDao
     */
    private $tripDao;
    /**
     * @var DriverDao
     */
    private $driverDao;
    /**
     * @var \MongoDB\Driver\Manager|PDO|null
     */
    private $conn;
    /**
     * @var TripRealtime
     */
    private $tripRealtime;
    /**
     * @var NegativeBalanceLimitService
     */
    private $negativeBalanceLimitService;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->tripDao = new TripDao;
        $this->driverDao = new DriverDao;
        $this->validator = new TaximeterTripValidator;
        $this->tripRealtime = new TripRealtime;
        $this->negativeBalanceLimitService = new NegativeBalanceLimitService;
    }

    /**
     * @param stdClass|null $request
     * @return array|mixed
     * @throws DriverException
     * @throws Exception
     */
    public function init(?stdClass $request)
    {
        $this->validator->validateInit($request);

        $driver = $this->driverDao
            ->findByUserId(Headers::getUserId(), false, true);

        $this->validateDriver($driver);

        try {
            $this->conn->beginTransaction();

            $trip = $this->createTrip($request, $driver);

            (new TripHistoryDao())->insertTripsFound([$trip], $driver->idDriver);

            $this->driverDao
                ->putInTripAndRemoveCustomerRefused($driver->idDriver);

            $tripFully = $this->tripDao->find($trip->getTripReference(), false);

            $this->tripRealtime
                ->hydrate($tripFully)
                ->createTrip();

            $this->conn->commit();

            $logData = (object)['trip' => $tripFully];

            $this->createLog(
                $logData,
                $trip->getTripReference(),
                Headers::getUserId(),
                "VIAGEM POR TAXÍMETRO INSERIDA"
            );
        } catch (Exception $e) {
            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            (new LogDao)->logException($e);

            throw $e;
        }

        return $tripFully;
    }

    /**
     * @param stdClass|null $request
     * @return array|mixed
     * @throws Exception
     */
    public function update(?stdClass $request)
    {
        $this->validator->validateUpdate($request);

        $trip = $this->tripDao
            ->find($request->tripReference, false);

        if ($trip->status != Trip::IN_PROGRESS)
            throw new Exception("Viagem não está mais em progresso");

        try {
            $this->conn->beginTransaction();

            list($latitude, $longitude) = [$trip->driver->latitude, $trip->driver->longitude];

            $destination = null;

            if (count($trip->tripWayPoints) == 0)
                $destination = $this->updateTripDestination($trip->destinationId, $latitude, $longitude);

            $this->tripDao
                ->updateEstimativeAndPrice(
                    $request->tripReference,
                    $request->distance,
                    $request->estimatedTripTime,
                    $request->price
                );

            /**
             * Feeding for trip object on realtime
             */
            $trip->distance = $request->distance;
            $trip->estimatedTripTime = $request->estimatedTripTime;
            $trip->price = $request->price;

            if (count($trip->tripWayPoints) == 0) {
                $trip->destination->name = $destination->getAddress();
                $trip->destination->latitude = $destination->getLatitude();
                $trip->destination->longitude = $destination->getLongitude();
                $trip->destination->neighborhood = $destination->getNeighborhood();
            }

            $this->conn->commit();
        } catch (Exception $e) {
            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            (new LogDao)->logException($e);

            throw $e;
        }

        $this->tripRealtime
            ->hydrate($trip)
            ->createTrip();

        return $trip;
    }

    /**
     * @param stdClass|null $request
     * @param $driver
     * @return Trip
     * @throws DriverCommissionException
     * @throws PriceException
     * @throws Exception
     */
    private function createTrip(?stdClass $request, $driver)
    {
        $address = (new GeocodingService)
            ->search("{$request->latitude},{$request->longitude}", true);
        $city = (new CityDao)
            ->findByCoordinate($request->latitude, $request->longitude);
        $tripPaymentForm = (new TripPaymentFormDao)
            ->findByType(PaymentFormTypeConst::TAXIMETER);
        $price = (new PriceDao)
            ->findById($request->priceId);
        $driverCommission = $this->findDriverCommission($city->id ?? null, $request->tripTypeId);

        /** @var Origin $origin */
        $origin = (new OriginDao)->create($address->toArray());
        /** @var Destination $destination */
        $destination = (new DestinationDao)->create($address->toArray());

        $trip = new Trip;
        $trip
            ->setCityId($driverCommission->getCityId())
            ->setOriginId($origin->getIdOrigin())
            ->setDestinationId($destination->getIdDestination())
            ->setUserId(Headers::getUserId())
            ->setDriverId($driver->idDriver)
            ->setStatus(Trip::IN_PROGRESS)
            ->setTripPaymentFormId($tripPaymentForm->idTripPaymentForm)
            ->setPrice($price->getMinPrice())
            ->setPriceId($price->getId())
            ->setDriverCommissionId($driverCommission->getIdDriverCommission())
            ->setMultiplierDynamic($request->multiplierDynamic ?? null)
            ->setTripCallTypeId(TripCallTypeConst::TAXIMETER)
            ->setTripTypeId($request->tripTypeId)
            ->setIdTrip($this->tripDao->sqlInsert($trip));

        return $trip;
    }

    /**
     * @param $driver
     * @throws DriverException
     */
    private function validateDriver($driver)
    {
        if (!$driver)
            throw new DriverException(502);

        if (
            $driver->status == Driver::IN_TRIP ||
            $driver->status == Driver::OFF
        )
            throw new DriverException(503);

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
     * @param $cityId
     * @param $tripTypeId
     * @return DriverCommission
     * @throws DriverCommissionException
     */
    private function findDriverCommission($cityId, $tripTypeId): DriverCommission
    {
        $driverCommission = (new DriverCommissionDao)
            ->findByCityAndTripType($cityId, $tripTypeId);

        if (!$driverCommission) {
            $driverCommission = (new DriverCommissionDao)
                ->findFirstByTripType($tripTypeId);
        }

        if (!$driverCommission)
            throw new DriverCommissionException(
                1350,
                compact('cityId', 'tripTypeId')
            );

        return new DriverCommission($driverCommission);
    }

    /**
     * @param $data
     * @param $idReference
     * @param $userId
     * @param $message
     * @return bool
     * @throws Exception
     */
    private function createLog($data, $idReference, $userId, $message): bool
    {
        $log = new Log(LogType::PROCESS);
        $log->setData($data)
            ->setIdReference($idReference)
            ->setUserId($userId)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }

    /**
     * @param int $destinationId
     * @param float $latitude
     * @param float $longitude
     * @return Destination
     * @throws Exception
     */
    private function updateTripDestination(
        int $destinationId,
        float $latitude,
        float $longitude
    ): Destination {
        $geocoder = (new GeocodingService)
            ->search("{$latitude},{$longitude}", true);

        $destination = new Destination;
        $destination
            ->setIdDestination($destinationId)
            ->setLatitude($latitude)
            ->setLongitude($longitude)
            ->setAddress($geocoder->getAddress())
            ->setNeighborhood($geocoder->getNeighborhood());

        (new DestinationDao)->updateInfo($destination);

        return $destination;
    }

    /**
     * @param int $tripReference
     * @param float $distance
     * @param float $estimatedTripTime
     * @param float $price
     * @throws Exception
     */
    public function updateEstimatedTripTimeAndDistance(
        string $tripReference,
        float $distance,
        float $estimatedTripTime,
        float $price
    ) {
        try {
            $this->conn->beginTransaction();

            $this->tripDao
                ->updateEstimativeAndDistance(
                    $tripReference,
                    $distance,
                    $estimatedTripTime,
                    $price
                );
            $this->conn->commit();
        } catch (Exception $e) {
            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            (new LogDao)->logException($e);

            throw $e;
        }
    }
}
