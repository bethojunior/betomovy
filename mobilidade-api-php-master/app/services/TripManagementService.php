<?php

namespace app\services;

use app\constant\TripConst;
use app\dao\CustomerDao;
use app\dao\TripDao;
use app\dao\TripManagementDao;
use app\dao\ZoneDao;
use Exception;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2019
 * Time: 15:25
 */
class TripManagementService
{
    private $dao;
    private $zoneDao;
    private $tripDao;
    private $defaultZones = [1, 2, 3];

    public function __construct()
    {
        $this->dao = new TripManagementDao;
        $this->zoneDao = new ZoneDao;
        $this->tripDao = new TripDao;
    }

    public function manageOpenTrips()
    {
        $trips = $this->dao
            ->findAll();

        return $trips;
    }

    public function getTripsToIncreaseArea()
    {
        $trips = $this->dao->getTripsToIncreaseArea();

        /**
         * Será removido a validação de zonas quando os aplicativos do cliente
         * estiverem todos atualizados
         */
        return array_map(function ($trip) {
            if (in_array($trip->zoneId, $this->defaultZones))
                return $trip;

            $this->updateToNextZone($trip->tripReference, $trip->cityId, $trip->timeToIncrease);
            $this->updateTripIfExpired($trip);
            return $trip;
        }, $trips);
    }

    private function getNextZone($cityId, $time)
    {
        return $this->zoneDao
            ->findByCityToIncreaseArea($cityId, $time);
    }

    /**
     * @param $tripReference
     * @param $cityId
     * @param $timeToIncrease
     * @throws Exception
     */
    private function updateToNextZone($tripReference, $cityId, $timeToIncrease): void
    {
        $zone = $this->getNextZone($cityId, $timeToIncrease);

        if ($zone)
            $this->tripDao->increaseArea($tripReference, $zone->idZone);
    }

    /**
     * @param $trip
     * @throws Exception
     */
    private function updateTripIfExpired($trip)
    {
        $timeToExpireTrip = $trip->timeToExpireTrip ?? TripConst::DEFAULT_TIME_TO_EXPIRE_TRIP;

        if (diffInSeconds($trip->date, now()) > $timeToExpireTrip)
            (new CustomerDao)
                ->cancelTrip($trip->tripReference, now(), $trip->userId, Trip::NOT_ANSWERED);
    }
}