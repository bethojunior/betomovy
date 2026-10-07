<?php

namespace app\services;
use app\dao\DestinationDao;
use app\dao\DriverDao;
use app\dao\OriginDao;
use app\dao\RouteDao;
use app\dao\RouteDriverAcceptedDao;
use app\dao\RouteTripItemTypeDao;
use app\dao\RouteWayPointDao;
use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 19:07
 */
class RouteDriverAcceptService
{
    private $dao;
    private $driverDao;
    private $routeDao;
    private $routeWayPointDao;
    private $routeTripItemTypeDao;

    public function __construct()
    {
        $this->dao = new RouteDriverAcceptedDao;
        $this->driverDao = new DriverDao;
        $this->routeDao = new RouteDao;
        $this->routeWayPointDao = new RouteWayPointDao;
        $this->routeTripItemTypeDao = new RouteTripItemTypeDao;
    }

    /**
     * @param $userId
     * @param stdClass $requestQuery
     * @return array
     * @throws Exception
     */
    public function findByUser($userId, stdClass $requestQuery)
    {
        $driver = $this->driverDao
            ->findByUserId($userId, false);

        $routesDriverAccept = $this->dao
            ->findByDriver($driver->idDriver, isset($requestQuery->active));

        return array_map(function ($routeDriverAccept) {
            $route = $this->routeDao
                ->find($routeDriverAccept->routeId, true);

            $route->routeWayPoints = $this->routeWayPointDao
                ->findByRoute($route->id);

            $route->routeTripItemTypes = $this->routeTripItemTypeDao
                ->findByRoute($route->id);

            $route->origin = (new OriginDao)->find($route->originId);
            $route->destination = (new DestinationDao)->find($route->destinationId);

            $route->driverAccept = $routeDriverAccept;

            return $route;
        }, $routesDriverAccept);
    }
}