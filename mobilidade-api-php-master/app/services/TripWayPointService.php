<?php

namespace app\services;

use app\dao\TripWayPointDao;
use app\exceptions\TripException;
use Exception;
use app\model\TripWayPoint;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/02/2019
 * Time: 11:11
 */
class TripWayPointService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new TripWayPointDao;
    }

    public function insertMany(array $wayPoints, $tripReference)
    {
        $filledWayPoints = array_map(function ($wayPoint) use ($tripReference) {
            $wayPoint = new TripWayPoint($wayPoint);
            $wayPoint->setId(null);
            $wayPoint->setTripReference($tripReference);

            return $wayPoint;
        }, $wayPoints);

        $this->dao->sqlInsertMany($filledWayPoints);

        return $this->dao->findByTrip($tripReference);
    }

    /**
     * @param $idTripWayPoint
     * @return \app\model\TripWayPoint
     * @throws TripException
     */
    public function find($idTripWayPoint)
    {
        $tripWayPoint = $this->dao->find($idTripWayPoint);

        if (!$tripWayPoint)
            throw new TripException(208);

        return new TripWayPoint($tripWayPoint);
    }

    /**
     * @param $tripReference
     * @return array|mixed
     */
    public function findByTrip($tripReference)
    {
        return $this->dao
            ->findByTrip($tripReference);
    }

    /**
     * @param $tripReference
     * @return bool
     * @throws Exception
     */
    public function disabled($tripReference)
    {
        return $this->dao->disabled($tripReference);
    }

    /**
     * @param $idTripWayPoint
     * @return bool
     * @throws Exception
     */
    public function confirm($idTripWayPoint)
    {
        return $this->dao->confirm($idTripWayPoint);
    }

    /**
     * @param $tripReference
     * @return array|mixed
     */
    public function findByTripNotConfirmation($tripReference)
    {
        return $this->dao->findByTripNotConfirmation($tripReference);
    }

    public function insertAllTripWayPoint($tripWayPoints)
    {
        $this->dao->sqlInsertMany($tripWayPoints);
    }
}