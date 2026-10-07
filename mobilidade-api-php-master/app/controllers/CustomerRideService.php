<?php

namespace app\controllers;

use app\constant\PushActionConst;
use app\constant\PushConst;
use app\dao\CustomerRideDao;
use app\dao\DestinationDao;
use app\dao\DriverDao;
use app\dao\LogDao;
use app\dao\OriginDao;
use app\dao\RideItemsDao;
use app\dao\RiderDao;
use app\dao\RiderItemDao;
use app\dao\RiderTripCustomerDao;
use app\dao\RideWayPointDao;
use app\dao\RouteDao;
use app\dao\RouteTripItemTypeDao;
use app\dao\RouteWayPointDao;
use app\dao\TripCustomerDao;
use app\dao\TripDao;
use app\dao\UserDao;
use app\exceptions\CardException;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\exceptions\PushException;
use app\exceptions\TripPaymentException;
use app\model\Config;
use app\model\Ride;
use app\model\Rider;
use app\model\RiderItem;
use app\model\RiderTripCustomer;
use app\model\RideWayPoint;
use app\model\Trip;
use app\model\TripCustomer;
use app\model\TripWayPoint;
use app\realtime\TripRealtime;
use app\services\RidePaymentService;
use app\services\TripWayPointService;
use app\utils\Connection;
use app\utils\Push;
use app\validator\RouteValidator;
use Exception;
use PDO;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2020
 * Time: 11:06
 */
class CustomerRideService
{
    /**
     * @var CustomerRideDao
     */
    private $dao;
    /**
     * @var RouteValidator
     */
    private $validator;
    private $routeDao;
    /**
     * @var DriverDao
     */
    private $driverDao;
    /**
     * @var RouteWayPointDao
     */
    private $routeWayPointDao;
    /**
     * @var RouteTripItemTypeDao
     */
    private $routeTripItemTypeDao;
    /**
     * @var TripDao
     */
    private $tripDao;
    /**
     * @var RiderDao
     */
    private $riderDao;
    /**
     * @var \MongoDB\Driver\Manager|PDO
     */
    private $conn;
    /**
     * @var RiderTripCustomerDao
     */
    private $riderTripCustomerDao;
    /**
     * @var TripCustomerDao
     */
    private $tripCustomerDao;
    /**
     * @var \app\realtime\TripRealtime
     */
    private $tripRealtime;
    /**
     * @var UserDao
     */
    private $userDao;
    /**
     * @var RidePaymentService
     */
    private $ridePaymentService;
    /**
     * @var RiderItemDao
     */
    private $riderItemDao;

    private $tripWayPointService;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->dao = new CustomerRideDao;
        $this->validator = new RouteValidator;
        $this->driverDao = new DriverDao;
        $this->routeDao = new RouteDao;
        $this->routeWayPointDao = new RouteWayPointDao;
        $this->routeTripItemTypeDao = new RouteTripItemTypeDao;
        $this->tripDao = new TripDao;
        $this->riderDao = new RiderDao;
        $this->riderTripCustomerDao = new RiderTripCustomerDao;
        $this->tripCustomerDao = new TripCustomerDao;
        $this->tripRealtime = new TripRealtime;
        $this->ridePaymentService = new RidePaymentService;
        $this->userDao = new UserDao;
        $this->riderItemDao = new RiderItemDao;
        $this->tripWayPointService = new TripWayPointService;
    }

    /**
     * @param stdClass $request
     * @return array
     * @throws Exception
     */
    public function find(stdClass $request)
    {
        $this->validator->validateFindRoute($request);

        $rides = Config::get('enable_route_in_progress_for_purchase') ?
            $this->dao
                ->findByCoordinateAllActive($request->lat, $request->lng) :
            $this->dao
                ->findByCoordinate($request->lat, $request->lng);

        $rides = array_map(function ($ride) {
            return $this->mountRoute($ride);
        }, $rides);

        return $rides;
    }

    public function findActives(?int $userId)
    {
        $rides = $this->dao
            ->findActivesByUserId($userId);

        return array_map(function ($ride) {
            return $this->mountRoute($ride);
        }, $rides);
    }


    public function findByUserId(?int $userId)
    {
        $rides = $this->dao
            ->findByUserId($userId);

        return array_map(function ($ride) {
            return $this->mountRouteSimple($ride);
        }, $rides);
    }

    private function mountRouteSimple($ride)
    {

        $route = $this->routeDao
            ->find($ride->routeId, true);

        $ride->riders = $this->mountRiders($ride->rideId);

        $route = (array)$route;

        $route['ride'] = $ride;

        $route = (object)$route;

        return $route;
    }

    /**
     * @param $ride
     * @return array|mixed
     * @throws Exception
     */
    private function mountRoute($ride)
    {
        $driver = $this->driverDao
            ->find($ride->driverId, false);

        $route = $this->routeDao
            ->find($ride->routeId, true);

        $route->routeWayPoints = $this->routeWayPointDao
            ->findByRoute($route->id);

        $route->routeTripItemTypes = $this->routeTripItemTypeDao
            ->findByRoute($route->id);

        $route->origin = (new OriginDao)->find($route->originId);
        $route->destination = (new DestinationDao)->find($route->destinationId);

        $ride->riders = $this->mountRiders($ride->rideId);

        $ride->rideItems = (new RideItemsDao)
            ->findByRide($ride->rideId);

        $ride->driver = $driver;

        $route->ride = $ride;

        return $route;
    }

    /**
     * @param int $rideId
     * @return array|mixed
     */
    private function mountRiders(int $rideId)
    {
        $riders = (new RiderDao)
            ->findByRide($rideId);

        foreach ($riders as $rider) {
            $rider->waypoints = (new RideWayPointDao)
                ->findByRiderTripCustomer($rider->riderTripCustomerId);
        }

        return $riders;
    }

    /**
     * @param $userId
     * @param stdClass $request
     * @return array
     * @throws Exception
     */
    public function requestRide($userId, ?stdClass $request)
    {
        $this->validator->validateRequestRide($request);

        try {
            $this->conn->beginTransaction();

            $this->validateRequestRide($trip, $request, $userId);

            $rider = $this->createRider($userId, $request, new Ride($trip->ride));

//            $user = $this->userDao->find($userId);

            $this->payment($rider, $request);

            $this->createRiderTripCustomer($request, $rider, $trip);

            $this->createRiderItems($request, $rider);

            $trip = $this->tripDao->find($request->tripReference);

            $this->notifyDriver($trip->driver->deviceToken);

            $this->conn->commit();

            $this->tripRealtime
                ->hydrate($trip)
                ->createTrip();

        } catch (CheckoutCardException $e) {
            $this->conn->rollBack();
            (new LogDao)->logException($e);
            throw $e;

        } catch (CheckoutServiceException $e) {
            $this->conn->rollBack();
            (new LogDao)->logException($e);
            throw $e;

        } catch (Exception $e) {
            (new LogDao)->logException($e);

            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            throw $e;
        }

        return $trip;
    }

    private function notifyDriver($deviceToken)
    {
        try {
            $push = new Push();
            $push
                ->setTitle('Informação da rota')
                ->setBody("Um novo cliente ingressou na viagem")
                ->setAction(PushActionConst::NEW_NOTIFICATION_APP)
                ->setPriority(PushConst::HIGH_PRIORITY);


            $push->notificationAllWithData([$deviceToken]);
        } catch (PushException $e) {
        }
    }

    private function createRider($userId, stdClass $request, Ride $ride): Rider
    {
        $rider = new Rider;
        $rider
            ->setRideId($ride->getId())
            ->setUserId($userId)
            ->setValue($request->value)
            ->setTripPaymentFormId($request->tripPaymentFormId)
            ->setId(
                $this->riderDao->sqlInsert($rider));

        return $rider;
    }

    private function createRiderTripCustomer(stdClass $request, Rider $rider, $trip)
    {
        foreach ($request->riderTripCustomers as $customer) {
            $riderTripCustomer = new RiderTripCustomer;
            $riderTripCustomer->setRiderId($rider->getId());

            if (isset($customer->afterPlace))
                $this->regroupWayPoints($request->tripReference, $customer);

            if (isset($customer->userId)) {
                $riderTripCustomer
                    ->setUserId($customer->userId)
                    ->setId($this->riderTripCustomerDao
                        ->sqlInsert($riderTripCustomer));

                $this->createRideWayPoint($customer, $riderTripCustomer, $rider);

                continue;
            }

            $tripCustomer = new TripCustomer($customer);
            $tripCustomer
                ->setId($this->tripCustomerDao
                    ->sqlInsert($tripCustomer));

            $riderTripCustomer
                ->setTripCustomerId($tripCustomer->getId())
                ->setId($this->riderTripCustomerDao
                    ->sqlInsert($riderTripCustomer));

            $this->createRideWayPoint($customer, $riderTripCustomer, $rider);
        }
    }

    private function createRideWayPoint(stdClass $customer, RiderTripCustomer $riderTripCustomer, Rider $rider)
    {
        if (isset($customer->waypoints) && is_array($customer->waypoints)) {
            foreach ($customer->waypoints as $waypoint) {
                $rideWayPoint = new RideWayPoint($waypoint);
                $rideWayPoint
                    ->setRideId($rider->getRideId())
                    ->setRiderTripCustomerId($riderTripCustomer->getId())
                    ->setId(
                        (new RideWayPointDao)
                            ->sqlInsert($rideWayPoint));
            }
        }
    }

    /**
     * @param $tripReference
     * @param $customer
     * @return array|mixed
     * @throws Exception
     */
    private function regroupWayPoints($tripReference, $customer)
    {
        $tripWayPoints = $this->tripWayPointService
            ->findByTripNotConfirmation($tripReference);

        $tripWayPoints = array_map(function ($item) use ($tripReference) {
            $tripWayPoint = new TripWayPoint($item);
            $tripWayPoint->setId(null);
            $tripWayPoint->setTripReference($tripReference);
            return $tripWayPoint;
        }, $tripWayPoints);

        $newBoardingPlace = new TripWayPoint($customer->waypoints[0]);
        $newBoardingPlace->setTripReference($tripReference);

        array_splice($tripWayPoints, $customer->afterPlace, 0, array($newBoardingPlace));

        $this->tripWayPointService->disabled($tripReference);

        $this->tripWayPointService
            ->insertAllTripWayPoint($tripWayPoints);
    }

    /**
     * @param \app\model\Rider $rider
     * @param stdClass $request
     * @throws CardException
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     * @throws TripPaymentException
     */
    private function payment(Rider $rider, stdClass $request): void
    {
        $this->ridePaymentService
            ->ridePayment(
                $rider,
                $request->cardId ?? null,
                $request->mpToken ?? null);
    }

    private function createRiderItems(stdClass $request, Rider $rider)
    {
        if (isset($request->riderItems) && is_array($request->riderItems))
            foreach ($request->riderItems as $riderItemRequest) {
                $riderItem = new RiderItem;
                $riderItem
                    ->setRiderId($rider->getId())
                    ->setQuantity($riderItemRequest->quantity ?? 1)
                    ->setRideItemId($riderItemRequest->rideItemId)
                    ->setId(
                        $this->riderItemDao
                            ->sqlInsert($riderItem));
            }
    }

    /**
     * @param $trip
     * @param $request
     * @param $userId
     * @throws Exception
     */
    private function validateRequestRide(&$trip, $request, $userId)
    {
        $trip = $this->tripDao->find($request->tripReference);

        if (!Config::get('enable_route_in_progress_for_purchase'))
            if ($trip->status != Trip::SCHEDULED)
                throw new Exception("Viagem não está mais disponível");

//        $riderExists = $this->riderDao
//            ->findByRideAndUser($trip->ride->id, $userId);
//
//        if ($riderExists)
//            throw new Exception("O passageiro já está está ingressado nessa carona");

        $countRiders = count($request->riderTripCustomers);

        if ($countRiders > $trip->ride->seatsAvailable)
            throw new Exception(
                "Esse veículo não tem espaço suficiente para essa quantidade de passageiros");
    }
}