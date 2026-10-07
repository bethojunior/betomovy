<?php

namespace app\services;

use app\constant\TripCallTypeConst;
use app\dao\CarDao;
use app\dao\DriverCommissionDao;
use app\dao\DriverDao;
use app\dao\LogDao;
use app\dao\RideDao;
use app\dao\RideItemsDao;
use app\dao\RouteDao;
use app\dao\RouteWayPointDao;
use app\dao\TripDao;
use app\dao\TripPaymentFormDao;
use app\dao\TripScheduledDao;
use app\exceptions\DriverCommissionException;
use app\model\Driver;
use app\model\DriverCommission;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\Ride;
use app\model\RideItem;
use app\model\Route;
use app\model\Trip;
use app\model\TripScheduled;
use app\realtime\TripRealtime;
use app\utils\Connection;
use app\validator\RideValidator;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 20:06
 */
class NewRideService
{
    private $conn;
    private $validator;
    private $routeDao;
    private $driverDao;
    private $driverCommissionDao;
    private $tripDao;
    private $tripWayPointService;
    private $routeWayPointDao;
    private $tripRealtime;
    /**
     * @var \app\model\Trip $trip
     */
    private $trip;
    private $carDao;
    private $tripPaymentFormDao;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->validator = new RideValidator;
        $this->routeDao = new RouteDao;
        $this->driverDao = new DriverDao;
        $this->carDao = new CarDao;
        $this->driverCommissionDao = new DriverCommissionDao;
        $this->tripDao = new TripDao;
        $this->tripWayPointService = new TripWayPointService;
        $this->routeWayPointDao = new RouteWayPointDao;
        $this->tripRealtime = new TripRealtime;
        $this->tripPaymentFormDao = new TripPaymentFormDao;
    }

    /**
     * @param $request
     * @param $userId
     * @return array
     * @throws Exception
     */
    public function new($request, $userId)
    {
        $this->validator->validateInsert($request);

        $this->conn->beginTransaction();

        try {
            $route = $this->findRoute($request->routeId);
            $driver = $this->findDriver($userId);

            $trip = $this->createTrip($request, $route, $driver);

            $this->createWayPoints($route, $trip);

            $ride = $this->createRide($trip, $driver, $route, $request->seatsAvailable);

            if (isset($request->tripItems))
                $this->createTripItems($ride, $request->tripItems);

            $trip = $this->tripDao
                ->find($trip->getTripReference());

            $logData = (object)[
                'trip' => $trip,
                'ride' => $ride->toStdClass(),
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
        } catch (Exception $e) {
            $this->conn->rollBack();
            (new LogDao)->logException($e);
            throw $e;
        }

        return $trip;
    }

    private function findRoute($routeId): Route
    {
        $route = $this->routeDao->find($routeId, true);

        return new Route($route);
    }

    /**
     * @param $request
     * @param \app\model\Route $route
     * @param \app\model\Driver $driver
     * @return Trip
     * @throws DriverCommissionException
     * @throws Exception
     */
    private function createTrip($request, Route $route, Driver $driver)
    {
        $driverCommission = $this->findDriverCommission($route->getCityId(), $route->getTripTypeId());
        $tripPaymentForm = $this->tripPaymentFormDao
            ->findMultiple();

        if (!$tripPaymentForm)
            throw new Exception("Pagamento múltiplo não encontrado");

        $trip = new Trip;
        $trip
            ->setUserId($driver->getUserId())
            ->setDriverId($driver->getIdDriver())
            ->setDate(now())
            ->setCityId($route->getCityId())
            ->setOriginId($route->getOriginId())
            ->setDestinationId($route->getDestinationId())
            ->setDriverCommissionId($driverCommission->getIdDriverCommission())
            ->setDistance($route->getEstimatedDistance())
            ->setEstimatedTripTime($route->getEstimatedTime())
            ->setTripTypeId($route->getTripTypeId())
            ->setTripPaymentFormId($tripPaymentForm->idTripPaymentForm)
            ->setStatus(Trip::SCHEDULED)
            ->setTripCallTypeId(TripCallTypeConst::RIDE)
            ->setPrice($route->getPrice())
            ->setPriceId($route->getPriceId())
            ->setIdTrip(
                $this->tripDao
                    ->sqlInsert($trip));

        $this->validTime($request->schedule ?? now(), $trip->getUserId());

        $this->scheduleTrip($trip->getTripReference(), $request->schedule, $driver->getIdDriver());

        $this->trip = $trip;

        return $trip;
    }

    /**
     * @param $time
     * @param $userId
     * @throws Exception
     */
    private function validTime($time, $userId)
    {
        $tripScheduledDao = new TripScheduledDao;

        $trips = $tripScheduledDao
            ->findUpcomingTripsScheduled($time, $userId);

        if (!empty($trips))
            throw new Exception("Você já possui viagem próximo a esse horário");
    }

    /**
     * @param $userId
     * @return \app\model\Driver
     * @throws Exception
     */
    private function findDriver($userId): Driver
    {
        $driver = $this->driverDao
            ->findByUserId($userId, false);

        return new Driver($driver);
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
     * @param string $tripReference
     * @param string $schedule
     * @param $driverId
     * @return \app\model\TripScheduled
     * @throws Exception
     */
    private function scheduleTrip(string $tripReference, string $schedule, $driverId): TripScheduled
    {
        if (dateIsBefore($schedule, now()))
            throw new Exception("Data do agendamento não pode ser menor que o horário atual");

        $tripScheduled = new TripScheduled;
        $tripScheduled
            ->setTripReference($tripReference)
            ->setSchedule($schedule)
            ->setDriverId($driverId)
            ->setId(
                (new TripScheduledDao)->sqlInsert($tripScheduled)
            );

        return $tripScheduled;
    }

    private function createWayPoints(Route $route, Trip $trip)
    {
        $routeWayPoint = $this->routeWayPointDao
            ->findByRoute($route->getId());

        if (!empty($routeWayPoint))
            $tripWayPoints = $this->tripWayPointService
                ->insertMany($routeWayPoint, $trip->getTripReference());

        return $tripWayPoints ?? [];
    }

    /**
     * @param \app\model\\app\model\Trip $trip
     * @param Driver $driver
     * @param \app\model\Route $route
     * @param int $seatsAvailable
     * @return Ride
     * @throws Exception
     */
    private function createRide(Trip $trip, Driver $driver, Route $route, int $seatsAvailable): Ride
    {
        $ride = new Ride;
        $ride
            ->setDriverId($driver->getIdDriver())
            ->setRouteId($route->getId())
            ->setTripReference($trip->getTripReference())
            ->setSeatsAvailable($seatsAvailable)
            ->setRouteLayout($route->getDefaultLayout())
            ->setId(
                (new RideDao)
                    ->sqlInsert($ride));

        return $ride;
    }

    /**
     * @param Ride $ride
     * @param array $data
     */
    private function createTripItems(Ride $ride, array $data): void
    {
        foreach ($data as $value) {
            $item = new RideItem;
            $item
                ->setRouteTripItemTypeId($value)
                ->setRideId($ride->getId())
                ->setId(
                    (new RideItemsDao)
                        ->sqlInsert($item)
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
            ->setApp(LogApp::DRIVER)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }
}