<?php

namespace app\services;

use app\model\AdminNotification;
use app\constant\AdminNotificationTypeConst;
use app\constant\UserGroupConst;
use app\dao\AdminNotificationDao;
use app\dao\AdminNotificationTypeDao;
use app\dao\DestinationDao;
use app\dao\DriverDao;
use app\dao\OriginDao;
use app\dao\RouteDao;
use app\dao\RouteDriverAcceptedDao;
use app\dao\RouteTripItemTypeDao;
use app\dao\RouteWayPointDao;
use app\exceptions\RouteException;
use app\utils\Headers;
use app\validator\RouteValidator;
use Exception;
use app\model\RouteDriverAccepted;
use stdClass;
use app\model\User;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/12/2019
 * Time: 09:41
 */
class RouteService
{
    private $dao;
    private $validator;
    private $routeWayPointDao;
    private $routeTripItemTypeDao;
    private $driverDao;
    private $routeDriverAcceptedDao;
    private $adminNotificationTypeDao;

    public function __construct()
    {
        $this->dao = new RouteDao;
        $this->validator = new RouteValidator;
        $this->routeWayPointDao = new RouteWayPointDao;
        $this->routeTripItemTypeDao = new RouteTripItemTypeDao;
        $this->driverDao = new DriverDao;
        $this->routeDriverAcceptedDao = new RouteDriverAcceptedDao;
        $this->adminNotificationTypeDao = new AdminNotificationTypeDao;
    }

    /**
     * @param stdClass $request
     * @return array|mixed
     * @throws Exception
     */
    public function find(stdClass $request)
    {
        $this->validator->validateFindRoute($request);

        $driverUserId = Headers::getUserId();

        $routes = $this->dao
            ->findByCoordinate($request->lat, $request->lng, $driverUserId);

        $routes = array_map(function ($route) {
            $route->routeWayPoints = $this->routeWayPointDao
                ->findByRoute($route->id);

            $route->routeTripItemTypes = $this->routeTripItemTypeDao
                ->findByRoute($route->id);

            $route->origin = (new OriginDao)->find($route->originId);
            $route->destination = (new DestinationDao)->find($route->destinationId);

            return $route;
        }, $routes);

        return $routes;
    }

    /**
     * @param $request
     * @param $userId
     * @return bool
     * @throws Exception
     */
    public function requestUse($request, $userId)
    {
        $this->validator->validateUseRoute($request);

        $driver = $this->driverDao
            ->findByUserId($userId, false);

        $requestExists = $this->routeDriverAcceptedDao
            ->findByRouteAndDriver($request->routeId, $driver->idDriver);

        if (!empty($requestExists))
            throw new RouteException(1730);

        $routeDriverAccepted = new RouteDriverAccepted;
        $routeDriverAccepted
            ->setRouteId($request->routeId)
            ->setDriverId($driver->idDriver)
            ->setId(
                (new RouteDriverAcceptedDao)
                    ->sqlInsert($routeDriverAccepted));

        $this->createAdminNotification(new User($driver));

        return true;
    }

    private function createAdminNotification(User $user)
    {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'];

        $adminNotificationType = $this->adminNotificationTypeDao
            ->find(AdminNotificationTypeConst::ROUTE_DRIVER_ACCEPTED_REQUEST);

        $cityId = $user->getCityId() ?? (new DriverDao())->findByUserId($user->getIdUser())->cityId ?? null;

        $message = str_replace('{userName}', $user->getName(), $adminNotificationType->defaultMessage);

        $adminNotification = new AdminNotification;
        $adminNotification
            ->setUserId($user->getIdUser())
            ->setIp($ip)
            ->setAdminNotificationTypeId(AdminNotificationTypeConst::ROUTE_DRIVER_ACCEPTED_REQUEST)
            ->setUserGroupId(UserGroupConst::DRIVER)
            ->setMessage($message)
            ->setTitle($adminNotificationType->name)
            ->setCityId($cityId)
            ->setId(
                (new AdminNotificationDao)
                    ->sqlInsert($adminNotification));
    }
}