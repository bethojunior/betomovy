<?php

namespace app\services;

use app\constant\DriverCalledConst;
use app\dao\DriverCalledDao;
use app\dao\DriversCloseTheTripDao;
use app\dao\OriginDao;
use app\utils\RedisDriverCalled;
use app\model\Config;
use app\model\ConfigType;
use app\model\DriverCalled;
use Exception;
use app\model\Origin;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * Date: 18/01/2019
 * Time: 16:42
 */
class DriverCalledService
{
    private $dao;
    private $driversCloseDao;
    private $originDao;

    public function __construct()
    {
        $this->dao = new DriverCalledDao;
        $this->driversCloseDao = new DriversCloseTheTripDao;
        $this->originDao = new OriginDao;
    }

    public function getAllByTrip($tripReference)
    {
        $drivers = (new RedisDriverCalled)->get("trip-{$tripReference}-call-drivers");

        if ($drivers)
            return $drivers;

        $drivers = $this->dao
            ->getByTrip($tripReference);

        return $drivers;
    }

    /**
     * @param $tripReference
     * @param $driverId
     * @param $status
     * @return void
     * @throws Exception
     */
    public function updateStatusDriver($tripReference, $driverId, $status)
    {
        $redis = new RedisDriverCalled();

        $drivers = $redis->get("trip-{$tripReference}-call-drivers");

        if ($drivers) {
            $drivers = array_map(function ($driver) use ($driverId, $status) {
                if ($driver->driverId == $driverId) {
                    $driver->status = $status;
                    $driver->updated_at = gmdate('Y-m-d H:i:s', strtotime(now()));
                }

                return $driver;
            }, $drivers);

            $redis->set("trip-{$tripReference}-call-drivers", $drivers);
        }

        $this->dao->updateStatus($tripReference, $driverId, $status);
    }

    /**
     * @param $driverCalledId
     * @param $status
     * @return bool
     * @throws Exception
     */
    public function updateStatusById($driverCalledId, $status, ?string $tripReference = null)
    {
        echo "[Driver Called] Atualizando dados: id={$driverCalledId} status={$status} tripReference={$tripReference}" . PHP_EOL;

        if ($tripReference) {
            echo "[Driver Called] Buscando cache no Redis" . PHP_EOL;
            $redis = new RedisDriverCalled();

            $drivers = $redis->get("trip-{$tripReference}-call-drivers");

            if ($drivers) {
                echo "[Driver Called] Cache de motoristas chamados encontrados, atualizando dados do cache" . PHP_EOL;
                $drivers = array_map(function ($driver) use ($driverCalledId, $status) {
                    if ($driver->id == $driverCalledId) {
                        $driver->status = $status;
                        $driver->updated_at = gmdate('Y-m-d H:i:s', strtotime(now()));
                    }

                    return $driver;
                }, $drivers);

                $redis->set("trip-{$tripReference}-call-drivers", $drivers);
                // return true;
            }
        }

        echo "[Driver Called] Atualizando motoristas chamados pelo MYSQL" . PHP_EOL;
        return $this->dao
            ->updateStatusById($driverCalledId, $status);
    }

    /**
     * @param array $driverCalledIds
     * @param $status
     * @return bool
     * @throws Exception
     */
    public function updateManyStatusById(array $driverCalledIds, $status, ?string $tripReference = null)
    {
        echo "[Driver Called] Atualizando dados: status={$status} tripReference={$tripReference}" . PHP_EOL;
        if ($tripReference) {
            echo "[Driver Called] Buscando cache no Redis" . PHP_EOL;
            $redis = new RedisDriverCalled();

            $drivers = $redis->get("trip-{$tripReference}-call-drivers");

            if ($drivers) {
                echo "[Driver Called] Cache de motoristas chamados encontrados, atualizando dados do cache" . PHP_EOL;
                $drivers = array_map(function ($driver) use ($driverCalledIds, $status) {
                    if (in_array($driver->id, $driverCalledIds)) {
                        $driver->status = $status;
                        $driver->updated_at = gmdate('Y-m-d H:i:s', strtotime(now()));
                    }

                    return $driver;
                }, $drivers);

                $redis->set("trip-{$tripReference}-call-drivers", $drivers);
                // return true;
            }
        }

        echo "[Driver Called] Atualizando motoristas chamados pelo MYSQL" . PHP_EOL;
        return $this->dao
            ->updateManyStatusById($driverCalledIds, $status);
    }

    /**
     * @param $tripReference
     * @param $driverCalledId
     * @return array|mixed
     */
    public function getStatusDriver($tripReference, $driverCalledId)
    {
        $drivers = (new RedisDriverCalled)->get("trip-{$tripReference}-call-drivers");

        if ($drivers) {
            $drivers = array_map(function ($driver) use ($driverCalledId) {
                if ($driver->id == $driverCalledId) {
                    return $driver;
                }

                return null;
            }, $drivers);

            $drivers = array_filter($drivers);

            if (count($drivers) > 0) {
                return array_shift($drivers);
            }
        }

        return $this->dao
            ->getStatusDriver($tripReference, $driverCalledId);
    }

    public function getStatusAllDrivers($tripReference)
    {
        $drivers = (new RedisDriverCalled)->get("trip-{$tripReference}-call-drivers");

        if ($drivers) {
            $drivers = array_map(function ($driver) {
                if ($driver->status !== DriverCalledConst::NOT_ANSWERED) {
                    return $driver;
                }

                return null;
            }, $drivers);

            $drivers = array_filter($drivers);

            if (count($drivers) > 0) {
                return $drivers;
            }
        }

        return $this->dao
            ->getStatusAllDrivers($tripReference);
    }

    /**
     * @param $tripReference
     * @param null $countDrivers
     * @return float|int
     * @throws Exception
     */
    public function getTimeToExpireTrip($tripReference, $countDrivers = null)
    {
        if (!$countDrivers) {
            $drivers = (new RedisDriverCalled)->get("trip-{$tripReference}-call-drivers");

            if (!$drivers) {
                $drivers = $this->getAllByTrip($tripReference);
            }

            $countDrivers = count($drivers);
        }

        $time = (int)Config::get('time_in_seconds_to_call_driver', ConfigType::TRIP);

        $intervalTime = (int)Config::get('time_in_seconds_to_pass_driver_call', ConfigType::TRIP);

        $totalTimeDrivers = $countDrivers * $time;
        $totalIntervalTime = $countDrivers * $intervalTime;

        return $totalTimeDrivers + $totalIntervalTime;
    }

    /**
     * @param \app\model\Trip $trip
     * @return array
     * @throws Exception
     */
    public function renewList(Trip $trip)
    {
        $origin = $this->originDao
            ->findByTripReference($trip->getTripReference());

        $driversFound = $this->driversCloseDao
            ->findDriversCloseByRule($trip, new Origin($origin));

        $redis = new RedisDriverCalled();
        $cachedDrivers = $redis->get("trip-{$trip->getTripReference()}-call-drivers");
        $cachedByDriverId = [];
        if (is_array($cachedDrivers)) {
            foreach ($cachedDrivers as $c) {
                $driverId = $c->driverId ?? $c->idDriver ?? null;
                if ($driverId !== null) {
                    $cachedByDriverId[$driverId] = $c;
                }
            }
        }

        $newDrivers = array_map(function ($driverCalled) use ($cachedByDriverId) {
            $idDriver = $driverCalled->idDriver;

            if (isset($cachedByDriverId[$idDriver])) {
                $cachedStatus = $cachedByDriverId[$idDriver]->status ?? null;
                if ($cachedStatus !== DriverCalledConst::REFUSED && $cachedStatus !== DriverCalledConst::ACCEPTED) {
                    return $cachedByDriverId[$idDriver];
                }
            }

            $driver = new DriverCalled;
            $driver
                ->setDriverId($idDriver)
                ->setTripReference($driverCalled->tripReference)
                ->setProximity($driverCalled->proximity)
                ->setDestinationProximity($driverCalled->destinationProximity)
                ->setStatus(DriverCalledConst::CALLING)
                ->setUpdatedAt(gmdate('Y-m-d H:i:s', strtotime(now())))
                ->setId($this->dao
                    ->sqlInsert($driver));

            return (object)
            array_merge(
                (array)$driver->toStdClass(),
                (array)$driverCalled);
        }, $driversFound);

        if (count($newDrivers) > 0) {
            $redis->set("trip-{$trip->getTripReference()}-call-drivers", $newDrivers);
        }

        return $newDrivers;
    }

    public function renewListAllDrivers(Trip $trip)
    {
        $redis = new RedisDriverCalled();
        $cachedDrivers = $redis->get("trip-{$trip->getTripReference()}-call-drivers");
        if (!$cachedDrivers || !is_array($cachedDrivers)) {
            $cachedDrivers = $this->dao->getByTrip($trip->getTripReference());
        }
        $cachedByDriverId = [];
        if (is_array($cachedDrivers)) {
            foreach ($cachedDrivers as $c) {
                $driverId = $c->driverId ?? $c->idDriver ?? null;
                if ($driverId !== null) {
                    $cachedByDriverId[$driverId] = $c;
                }
            }
        }

        $limitDriversCalledGreaterRadius = (int)Config::get('limit_drivers_called_greater_radius', ConfigType::TRIP);

        $driversFound = $this->driversCloseDao
            ->findDriversClose($trip, $limitDriversCalledGreaterRadius > 0 ? $limitDriversCalledGreaterRadius : null);

        $seenDriverIds = [];
        $driversFoundUnique = [];
        if (is_array($driversFound)) {
            foreach ($driversFound as $d) {
                $idDriver = $d->idDriver ?? $d->driverId ?? null;
                if ($idDriver !== null && !isset($seenDriverIds[$idDriver])) {
                    $seenDriverIds[$idDriver] = true;
                    $driversFoundUnique[] = $d;
                }
            }
        }

        $fullList = [];
        if (!empty($driversFoundUnique)) {
            foreach ($driversFoundUnique as $driverCalled) {
                $idDriver = $driverCalled->idDriver ?? $driverCalled->driverId ?? null;
                if ($idDriver === null) {
                    continue;
                }
                if (isset($cachedByDriverId[$idDriver])) {
                    $cached = $cachedByDriverId[$idDriver];
                    $cachedStatus = $cached->status ?? null;
                    if ($cachedStatus === DriverCalledConst::REFUSED || $cachedStatus === DriverCalledConst::ACCEPTED) {
                        continue;
                    }
                    $fullList[] = $cached;
                    continue;
                }
                $driver = new DriverCalled();
                $driver
                    ->setDriverId($idDriver)
                    ->setTripReference($driverCalled->tripReference)
                    ->setProximity($driverCalled->proximity)
                    ->setDestinationProximity($driverCalled->destinationProximity)
                    ->setStatus(DriverCalledConst::CALLING)
                    ->setUpdatedAt(gmdate('Y-m-d H:i:s', strtotime(now())))
                    ->setId($this->dao
                        ->sqlInsert($driver));
                $newDriver = (object) array_merge(
                    (array) $driverCalled,
                    (array) $driver->toStdClass()
                );
                $cachedByDriverId[$idDriver] = $newDriver;
                $fullList[] = $newDriver;
            }
        }

        if (empty($fullList) && !empty($cachedByDriverId)) {
            $fullList = array_values(array_filter($cachedByDriverId, function ($d) {
                $s = $d->status ?? null;
                return $s !== DriverCalledConst::REFUSED && $s !== DriverCalledConst::ACCEPTED;
            }));
        }

        if (count($fullList) > 0) {
            $redis->set("trip-{$trip->getTripReference()}-call-drivers", $fullList);
        }

        return $fullList;
    }
}
