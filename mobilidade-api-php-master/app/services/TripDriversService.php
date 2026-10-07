<?php

namespace app\services;

use app\dao\CentralCustomerDao;
use app\dao\CustomerDao;
use app\dao\TollTripDao;
use app\dao\TripCustomerDao;
use app\dao\TripDao;
use app\dao\TripDriversDao;
use app\dao\TripWayPointDao;
use app\dao\UserDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/01/2019
 * Time: 13:47
 */
class TripDriversService
{
    private $dao;
    private $tripDao;
    private $tripWayPointDao;
    private $riskAreaService;

    public function __construct($dao = null, $tripDao = null, $tripWayPointDao = null, $riskAreaService = null)
    {
        $this->dao = $dao ?? new TripDriversDao;
        $this->tripDao = $tripDao ?? new TripDao;
        $this->tripWayPointDao = $tripWayPointDao ?? new TripWayPointDao;
        $this->riskAreaService = $riskAreaService ?? new RiskAreaVerificationService();
    }

    public function findTripToCallDrivers()
    {
        $trips = $this->dao
            ->getAll();

        return $trips;
    }

    /**
     * @param $tripReference
     * @return bool
     * @throws Exception
     */
    public function updateTripToStartCall($tripReference)
    {
        return $this->tripDao
            ->updateTripToStartCall($tripReference);
    }

    /**
     * @param $tripReference
     * @param $driverId
     * @throws Exception
     */
    public function updateCallingDriverTrip($tripReference, $driverId)
    {
        $this->tripDao
            ->updateCallingDriver($tripReference, $driverId);
    }

    public function find($tripReference)
    {
        return $this->dao
            ->find($tripReference);
    }

    public function findTripCallingDriver($driverId, $listTripsDenied = [])
    {
        $trips = $this->dao
            ->findTripCallingDriver($driverId, $listTripsDenied);

        return array_map(function ($trip) {
            $trip = $this->enrichWithCustomerData($trip);
            $trip = $this->enrichWithWayPoints($trip);
            $trip = $this->enrichWithFinancialData($trip);
            $trip = $this->enrichWithTolls($trip);
            $trip = $this->enrichWithRiskAreaData($trip);

            return $trip;
        }, $trips);
    }

    private function enrichWithCustomerData($trip)
    {
        $identifiers = $this->tripDao->findCustomerIdentifiers($trip->tripReference);

        $customer = $this->findCustomer($identifiers);

        if ($customer) {
            $trip->ratingCustomer = $customer->rating ?? null;
            $trip->nameCustomer = $customer->name ?? $customer->nickname ?? null;
            $trip->customerImage = $customer->profileImage ?? null;
            $trip->quantityTripsCustomer = $customer->quantityTrips ?? null;

            return $trip;
        }

        $user = (new UserDao)->findWithProfileImage($trip->userId);

        $trip->ratingCustomer = $user->rating;
        $trip->nameCustomer = $user->name;
        $trip->customerImage = $user->profileImage;
        $trip->quantityTripsCustomer = $user->quantityTrips;

        return $trip;
    }

    /**
     * Mesma prioridade usada em TripDao::mountCustomer para os detalhes da trip:
     * tripCustomerId -> customerId -> centralCustomerId.
     * @param $identifiers
     * @return mixed|null
     */
    private function findCustomer($identifiers)
    {
        if (isset($identifiers->tripCustomerId)) {
            return (new TripCustomerDao())->find($identifiers->tripCustomerId);
        }

        if (isset($identifiers->customerId)) {
            return (new CustomerDao())->find($identifiers->customerId);
        }

        if (isset($identifiers->centralCustomerId)) {
            return (new CentralCustomerDao())->find($identifiers->centralCustomerId);
        }

        return null;
    }

    private function enrichWithWayPoints($trip)
    {
        $trip->tripWayPoints = $this->tripWayPointDao
            ->findByTrip($trip->tripReference);

        return $trip;
    }

    private function enrichWithFinancialData($trip)
    {
        $values = $this->tripDao->findNetPrice($trip->tripReference);

        if ($values) {
            $trip->driverValue = $values->driverValue;
        }

        return $trip;
    }

    private function enrichWithTolls($trip)
    {
        $trip->tolls = (new TollTripDao)->findByTrip($trip->idTrip);

        return $trip;
    }

    private function enrichWithRiskAreaData($trip)
    {
        try {
            if (!$this->hasValidCoordinates($trip)) {
                $trip->riskArea = $this->getDefaultRiskAreaData();
                return $trip;
            }

            $trip->riskArea = $this->riskAreaService->verifyTripRiskAreas(
                (float) $trip->startLatitude,
                (float) $trip->startLongitude,
                (float) $trip->endLatitude,
                (float) $trip->endLongitude,
                isset($trip->cityId) ? (int) $trip->cityId : null
            );

        } catch (Exception $e) {
            $trip->riskArea = $this->getDefaultRiskAreaData();
        }

        return $trip;
    }

    private function hasValidCoordinates($trip)
    {
        return isset($trip->startLatitude)
            && isset($trip->startLongitude)
            && isset($trip->endLatitude)
            && isset($trip->endLongitude)
            && is_numeric($trip->startLatitude)
            && is_numeric($trip->startLongitude)
            && is_numeric($trip->endLatitude)
            && is_numeric($trip->endLongitude);
    }

    private function getDefaultRiskAreaData()
    {
        return (object)[
            'origin' => false,
            'destination' => false
        ];
    }
}
