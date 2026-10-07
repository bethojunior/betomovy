<?php

namespace app\services;
use app\dao\DriverOnlineTimeDao;
use app\model\Driver;
use app\model\DriverOnlineTime;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2019
 * Time: 14:50
 */
class DriverOnlineTimeService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new DriverOnlineTimeDao;
    }

    /**
     * @param \app\model\Driver $driver
     * @return bool
     * @throws Exception
     */
    public function updateStatus(Driver $driver)
    {
        $driverOnlineTime = $this->findActive($driver->getIdDriver());

        if (!$driverOnlineTime->getIdDriverOnlineTime() && $driver->getStatus() == Driver::AVAILABLE) {
            $this->create($driverOnlineTime, $driver->getIdDriver());
            return true;
        }

        if ($driverOnlineTime->getIdDriverOnlineTime() && $driver->getStatus() == Driver::OFF)
            return $this->dao
                ->turnOff($driverOnlineTime->getIdDriverOnlineTime());

        return false;
    }

    public function findActive($idDriver): DriverOnlineTime
    {
        $onlineTime = $this->dao
            ->findActive($idDriver);

        return new DriverOnlineTime($onlineTime);
    }

    public function create(DriverOnlineTime $driverOnlineTime, $driverId): DriverOnlineTime
    {
        $driverOnlineTime
            ->setDriverId($driverId)
            ->setIdDriverOnlineTime(
                $this->dao
                    ->sqlInsert($driverOnlineTime)
            );

        return $driverOnlineTime;
    }
}