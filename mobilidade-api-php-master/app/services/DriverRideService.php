<?php

namespace app\services;
use app\dao\DestinationDao;
use app\dao\DriverDao;
use app\dao\OriginDao;
use app\dao\RideDao;
use app\dao\RideItemsDao;
use app\dao\RiderDao;
use app\dao\RouteDao;
use app\dao\RouteTripItemTypeDao;
use app\dao\RouteWayPointDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/12/2019
 * Time: 12:05
 */
class DriverRideService
{
    /**
     * @var RideDao
     */
    private $dao;
    /**
     * @var DriverDao
     */
    private $driverDao;
    /**
     * @var RouteDao
     */
    private $routeDao;
    /**
     * @var RouteTripItemTypeDao
     */
    private $routeTripItemTypeDao;
    /**
     * @var RouteWayPointDao
     */
    private $routeWayPointDao;

    public function __construct()
    {
        $this->dao = new RideDao;
        $this->routeDao = new RouteDao;
        $this->routeWayPointDao = new RouteWayPointDao;
        $this->routeTripItemTypeDao = new RouteTripItemTypeDao;
        $this->driverDao = new DriverDao;
    }

    /**
     * @param $userId
     * @return array
     * @throws Exception
     */
    public function findOffered($userId)
    {
        $driver = $this->driverDao
            ->findByUserId($userId, false);

        $rides = $this->dao->findOfferedRides($driver->idDriver);

        return array_map(function ($ride) {
            $route = $this->routeDao
                ->find($ride->routeId, true);

            $route->routeWayPoints = $this->routeWayPointDao
                ->findByRoute($route->id);

            $route->routeTripItemTypes = $this->routeTripItemTypeDao
                ->findByRoute($route->id);

            $route->origin = (new OriginDao)->find($route->originId);
            $route->destination = (new DestinationDao)->find($route->destinationId);

            $ride->riders = (new RiderDao)
                ->findByRide($ride->rideId);

            $ride->rideItems = (new RideItemsDao)
                ->findByRide($ride->rideId);

            $route->ride = $ride;

            return $route;
        }, $rides);
    }
}