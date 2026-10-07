<?php

namespace app\services;

use app\constant\DriverCalledConst;
use app\dao\DriverCalledDao;
use app\dao\DriversCloseTheTripDao;
use app\utils\RedisDriverCalled;
use app\model\Driver;
use app\model\DriverCalled;
use Exception;
use app\model\Origin;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * Date: 18/01/2019
 * Time: 13:55
 */
class CustomerTripCallService
{
    private $dao;
    private $driverCalledDao;
    private $driverCalledService;
    private $tripCallStrategyResolver;
    private $driversFound;

    public function __construct()
    {
        $this->dao = new DriversCloseTheTripDao;
        $this->driverCalledDao = new DriverCalledDao;
        $this->driverCalledService = new DriverCalledService;
        $this->tripCallStrategyResolver = new TripCallStrategyResolver;
    }

    /**
     * @param Trip $trip
     * @param \app\model\Origin $origin
     * @return mixed
     * @throws Exception
     */
    public function callDrivers(Trip $trip, Origin $origin)
    {
        $driversCalled['resultDrivers'] = $this->getDriversToCall($trip, $origin);

        (new RedisDriverCalled)->set("trip-{$trip->getTripReference()}-call-drivers", $driversCalled['resultDrivers']);

//        $driversCalled['resultPush'] = $this->sendPushToDriversClose();

        return $driversCalled;
    }

    /**
     * @param Trip $trip
     * @param Origin $origin
     * @return array
     * @throws Exception
     *
     * validate se o driver tem horas disponiveis
     */
    private function getDriversToCall(Trip $trip, Origin $origin)
    {
        if ($this->tripCallStrategyResolver->shouldUseFastFingerByCityConfig($origin)) {
            $this->driversFound = $this->driverCalledService->renewListAllDrivers($trip);
            return $this->driversFound;
        }

        $this->driversFound = $this->dao
            ->findDriversCloseByRule($trip, $origin);

        if (empty($this->driversFound))
            $this->driversFound = $this->dao
                ->findDriversCloseByRule($trip, $origin, true);

        return array_map(function ($driverCalled) {
            $driver = new DriverCalled;
            $driver
                ->setDriverId($driverCalled->idDriver)
                ->setTripReference($driverCalled->tripReference)
                ->setProximity($driverCalled->proximity)
                ->setDestinationProximity($driverCalled->destinationProximity)
                ->setStatus(DriverCalledConst::CALLING)
                ->setUpdatedAt(gmdate('Y-m-d H:i:s', strtotime(now())))
                ->setId($this->driverCalledDao
                ->sqlInsert($driver));

            return (object)
            array_merge(
                (array)$driver->toStdClass(),
                (array)$driverCalled);
        }, $this->driversFound);
    }

    private function sendPushToDriversClose()
    {
        $deviceTokens = array_map(function ($driver) {
            return $driver->deviceToken;
        }, $this->driversFound);

        return (new Driver)->sendTripNotifications($deviceTokens);
    }
}
