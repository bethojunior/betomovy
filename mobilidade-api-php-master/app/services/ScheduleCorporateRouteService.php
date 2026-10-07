<?php


namespace app\services;

use app\constant\RoutePitStopTypeConst;
use app\constant\TripCallTypeConst;
use app\dao\CompanyWorkerDao;
use app\dao\DriverCommissionDao;
use app\dao\DriverDao;
use app\dao\LogDao;
use app\dao\RideDao;
use app\dao\RiderDao;
use app\dao\RiderTripCustomerDao;
use app\dao\RideWayPointDao;
use app\dao\RouteDao;
use app\dao\RouteWayPointDao;
use app\dao\ScheduleCorporateRouteCustomerDao;
use app\dao\ScheduleCorporateRouteDao;
use app\dao\TripCustomerDao;
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
use app\model\Rider;
use app\model\RiderTripCustomer;
use app\model\RideWayPoint;
use app\model\Route;
use app\model\ScheduleCorporateRoute;
use app\model\Trip;
use app\model\TripCustomer;
use app\model\TripScheduled;
use app\model\User;
use app\realtime\TripRealtime;
use app\utils\Connection;
use app\utils\Headers;
use app\validator\ScheduleCorporateRouteValidator;
use Exception;
use stdClass;

class ScheduleCorporateRouteService
{

    private $conn;
    private $scheduleCorporateRouteDao;
    private $routeDao;
    private $driverDao;
    private $validator;
    private $driverCommissionDao;
    private $tripPaymentFormDao;
    private $tripDao;
    private $trip;
    private $scheduleCorporateRouteCustomerDao;
    private $companyWorkerDao;
    private $riderTripCustomerDao;
    private $tripCustomerDao;
    private $tripRealtime;
    private $routeWayPointDao;
    private $tripWayPointService;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->scheduleCorporateRouteDao = new ScheduleCorporateRouteDao;
        $this->routeDao = new RouteDao;
        $this->driverDao = new DriverDao;
        $this->driverCommissionDao = new DriverCommissionDao;
        $this->tripPaymentFormDao = new TripPaymentFormDao;
        $this->tripDao = new TripDao;
        $this->validator = new ScheduleCorporateRouteValidator;
        $this->scheduleCorporateRouteCustomerDao = new ScheduleCorporateRouteCustomerDao;
        $this->companyWorkerDao = new CompanyWorkerDao;
        $this->riderTripCustomerDao = new RiderTripCustomerDao;
        $this->tripCustomerDao = new TripCustomerDao;
        $this->tripWayPointService = new TripWayPointService;
        $this->routeWayPointDao = new RouteWayPointDao;
        $this->tripRealtime = new TripRealtime;
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function availableOnDate($request)
    {
        if (!isset($request->date))
            throw new Exception("Data não informada");
        return $this->scheduleCorporateRouteDao->availableOnDate($request->date);
    }

    /**
     * @param $request
     * @return null
     * @throws Exception
     */
    public function new($request)
    {
        $this->validator->validateInsert($request);

        try {

            $this->conn->beginTransaction();

            $scheduleCorporateRoute = $this->findScheduleCorporateRoute($request->scheduleCorporateRouteId);

            $user = new User($this->companyWorkerDao->findByField('companyId', $scheduleCorporateRoute->getCompanyId()));

            $route = $this->findRoute($scheduleCorporateRoute->getCorporateRouteId());

            $driver = $this->findDriver(Headers::getUserId());

            $customers = $this->findCustomers($scheduleCorporateRoute->getId());

            $trip = $this->createTrip($request, $route, $driver, $scheduleCorporateRoute);

            $this->createWayPoints($route, $trip, $customers);

            $ride = $this->createRide($trip, $driver, $route, 0);

            $rider = $this->createRider($user->getIdUser(), $trip, $ride);

            $this->createRiderTripCustomer($customers, $rider);


            $logData = (object)[
                'trip' => $trip
            ];

            $this->createLog(
                $logData,
                $trip->getTripReference(),
                $trip->getUserId(),
                "VIAGEM INSERIDA",
                LogCriticalType::AVISO
            );

            $trip = (new TripDao)
                ->find($trip->getTripReference());

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

    /**
     * @param Route $route
     * @param \app\model\Trip $trip
     * @param array $customers
     * @return array|mixed
     */
    private function createWayPoints(Route $route, Trip $trip, array $customers)
    {

        $boardings = array_map(function ($item) use ($route, $trip) {
            $object = new stdClass();

            $object->routeId = $route->getId();
            $object->routePitStopTypeId = RoutePitStopTypeConst::BOARDING;
            $object->tripReference = $trip->getTripReference();
            $object->address = $item->address;
            $object->latitude = $item->latitude;
            $object->longitude = $item->longitude;
            return $object;
        }, $customers);

        if (!empty($boardings))
            $tripWayPoints = $this->tripWayPointService
                ->insertMany($boardings, $trip->getTripReference());


        return $tripWayPoints ?? [];
    }

    /**
     * @param Trip $trip
     * @param \app\model\Driver $driver
     * @param Route $route
     * @param int $seatsAvailable
     * @return \app\model\Ride
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

    private function createRiderTripCustomer(array $customers, Rider $rider)
    {
        foreach ($customers as $customer) {

            $riderTripCustomer = new RiderTripCustomer;
            $riderTripCustomer->setRiderId($rider->getId());

            $tripCustomer = new TripCustomer($customer);
            $tripCustomer->setId(null);
            $tripCustomer
                ->setId((new TripCustomerDao)->sqlInsert($tripCustomer));


            $riderTripCustomer
                ->setTripCustomerId($tripCustomer->getId())
                ->setId((new RiderTripCustomerDao)
                    ->sqlInsert($riderTripCustomer));

            $this->createRideWayPoint($customer, $riderTripCustomer, $rider);
        }
    }

    private function createRideWayPoint(stdClass $customer, RiderTripCustomer $riderTripCustomer, Rider $rider)
    {
        $rideWayPoint = new RideWayPoint($customer);
        $rideWayPoint
            ->setId(null)
            ->setRideId($rider->getRideId())
            ->setRiderTripCustomerId($riderTripCustomer->getId())
            ->setRoutePitStopTypeId(RoutePitStopTypeConst::BOARDING)
            ->setId(
                (new RideWayPointDao)
                    ->sqlInsert($rideWayPoint));

    }

    private function createRider($userId, Trip $trip, Ride $ride): Rider
    {

        $rider = new Rider;
        $rider
            ->setRideId($ride->getId())
            ->setUserId($userId)
            ->setValue($trip->getPrice())
            ->setTripPaymentFormId($trip->getTripPaymentFormId())
            ->setId(
                (new RiderDao)
                    ->sqlInsert($rider));

        return $rider;
    }

    /**
     * @param $request
     * @param Route $route
     * @param \app\model\Driver $driver
     * @param \app\model\ScheduleCorporateRoute $scheduleCorporateRoute
     * @return Trip
     * @throws DriverCommissionException
     * @throws Exception
     */
    private function createTrip($request, Route $route, Driver $driver, ScheduleCorporateRoute $scheduleCorporateRoute)
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
            ->setCityId($route->getId())
            ->setOriginId($route->getOriginId())
            ->setDestinationId($route->getDestinationId())
            ->setDriverCommissionId($driverCommission->getIdDriverCommission())
            ->setDistance($route->getEstimatedDistance())
            ->setEstimatedTripTime($route->getEstimatedTime())
            ->setTripTypeId($route->getTripTypeId())
            ->setTripPaymentFormId($tripPaymentForm->idTripPaymentForm)
            ->setStatus(Trip::SCHEDULED)
            ->setTripCallTypeId(TripCallTypeConst::CORPORATIVO)
            ->setScheduleCorporateRouteId($scheduleCorporateRoute->getId())
            ->setPrice($route->getPrice())
            ->setPriceId($route->getPriceId())
            ->setIdTrip(
                $this->tripDao
                    ->sqlInsert($trip));


        $schedule = $request->schedule . ' ' . $scheduleCorporateRoute->getSchedule();

        $this->validTime($schedule ?? now(), $trip->getUserId());

        $this->scheduleTrip($trip->getTripReference(), $schedule, $driver->getIdDriver());

        $this->trip = $trip;

        return $trip;
    }

    /**
     * @param string $tripReference
     * @param string $schedule
     * @param $driverId
     * @return TripScheduled
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

    private function findScheduleCorporateRoute($scheduleCorporateRouteId)
    {
        $scheduleCorporateRoute = $this->scheduleCorporateRouteDao->find($scheduleCorporateRouteId);

        return new ScheduleCorporateRoute($scheduleCorporateRoute);
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


    private function findCustomers($scheduleCorporateRouteId)
    {
        return $this->scheduleCorporateRouteCustomerDao->findCustomerByCorporateRoute($scheduleCorporateRouteId);
    }


    /**
     * @param $scheduleCorporateRouteId
     * @return Route
     */
    private function findRoute($scheduleCorporateRouteId): Route
    {
        $route = $this->routeDao->findByCorporateRouteId($scheduleCorporateRouteId);

        return new Route($route);
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

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function tripsByDriver($request)
    {
        if (!isset($request->driverId))
            throw new Exception("Motorista não informado");

        return $this->scheduleCorporateRouteDao->getTripsByDriver($request->driverId);
    }
}