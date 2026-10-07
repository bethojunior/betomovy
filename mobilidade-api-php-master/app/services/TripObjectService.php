<?php

namespace app\services;
use app\dao\TripDao;
use app\dao\TripWayPointDao;
use app\model\Driver;
use Exception;
use app\model\Location;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/04/2019
 * Time: 11:56
 */
class TripObjectService
{
    /**
     * @param $trip
     * @param bool $calculateRoute
     * @param bool $fullDriverObject
     * @return mixed
     * @throws Exception
     */
    public function mountFindObject($trip, $calculateRoute = false, $fullDriverObject = true)
    {
        $this->mountEstablishmentObject($trip);
        $this->mountOriginObject($trip);
        $this->mountDestinationObject($trip);
        $this->mountTripWayPointsObject($trip);
        $this->mountCustomerObject($trip);
        $this->mountDriverObject($trip, $calculateRoute, $fullDriverObject);
        $this->mountRewardTripObject($trip);
        $this->mountTripCancellationCustomerFeeObject($trip);

        return $trip;
    }

    /**
     * @param $trip
     */
    private function mountEstablishmentObject(&$trip)
    {
        $trip->establishment = $this->extractFields($trip, 'est_');
    }

    /**
     * @param $trip
     */
    private function mountOriginObject(&$trip)
    {
        $trip->origin = $this->extractFields($trip, 'o_') ?? $trip->establishment;
    }

    /**
     * @param $trip
     */
    private function mountDestinationObject(&$trip)
    {
        $destination = $this->extractFields($trip, 'des_');
        $station = $this->extractFields($trip, 'sta_');

        $trip->destination = $station ?? $destination;
    }

    /**
     * @param $trip
     */
    private function mountCustomerObject(&$trip)
    {
        $partnerCustomer = $this->extractFields($trip, 'cp_');
        $customer = $this->extractFields($trip, 'cust_');

        $trip->customer = $partnerCustomer ?? $customer;
    }

    /**
     * @param $trip
     */
    private function mountRewardTripObject(&$trip)
    {
        $trip->rewardTrip = $this->extractFields($trip, 'rt_');
    }

    /**
     * @param $trip
     */
    private function mountTripWayPointsObject(&$trip)
    {
        $trip->tripWayPoints = (new TripWayPointDao)
            ->findByTrip($trip->tripReference);
    }

    private function mountTripCancellationCustomerFeeObject(&$trip)
    {
        $trip->customerCancellationFee = $this->extractFields($trip, 'cf_');
    }

    /**
     * @param $trip
     * @param bool $calculateRoute
     * @param bool $fullDriverObject
     * @throws Exception
     */
    private function mountDriverObject(&$trip, $calculateRoute = false, $fullDriverObject = true)
    {
        $driver = $this->extractFields($trip, 'dri_');
        if ($driver && $fullDriverObject) {
            $driver->location = (new Location($driver))->toStdClass();
            $driver->balance = $this->extractFields($trip, 'bdr_');
            $driver->car = $this->extractFields($trip, 'cr_');
            $driver->estimative = (new Driver)->generateNullEstimative();

            $tripPreAccepted = (new TripDao)
                ->findTripPreAccepted($trip->driverId);
            $driver->tripPreAccepted = empty($tripPreAccepted) ? null : $tripPreAccepted;
        }

        $trip->driver = $driver;
    }

    /**
     * @param $object
     * @param string $alias
     * @return null|stdClass
     */
    private function extractFields(&$object, string $alias): ?stdClass
    {
        $arrayObj = array_filter(get_object_vars($object), function ($value, $key) use ($alias) {
            return strstr($key, $alias);
        }, ARRAY_FILTER_USE_BOTH);

        $reindexedArray = [];
        $hasValue = false;

        array_walk($arrayObj, function ($value, $key) use (&$reindexedArray, &$object, $alias, &$hasValue) {
            $newKey = str_replace($alias, '', $key);
            $reindexedArray[$newKey] = $value;
            unset($object->$key);
            $hasValue = !$hasValue && !$value ? false : true;
        });

        if (!$hasValue)
            return null;

        return (object)$reindexedArray;
    }
}