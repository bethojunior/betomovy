<?php

namespace app\validator;

use app\dao\CityConfigDao;
use app\exceptions\RequestValidatorException;
use app\exceptions\TripException;
use app\model\Trip;
use app\services\TripService;
use app\validator\contracts\Validator;

use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/02/2019
 * Time: 16:00
 */
class TripValidator extends Validator
{
    /**
     * @param $request
     * @param bool $validCity
     * @param bool $validTripCustomer
     * @return bool
     * @throws Exception
     */
    public function validateNewTrip($request, $validCity = true, $validTripCustomer = false)
    {
        $this->requestIsNotEmpty($request);

        if ($validCity)
            $this->cityIdIsValid($request->cityId ?? '');

        $this->tripTypeIdIsValid($request->tripTypeId ?? '');

        if ($validTripCustomer) {
            $this->nameCustomerIsValid($request->tripCustomer->name ?? '');
            $this->phoneCustomerIsValid($request->tripCustomer->phone ?? '');
        }

        if (isset($request->recalculatedTrip)) {
            $this->isNumber($request->recalculatedTrip->oldPrice,
                'O campo oldPrice está inválido');
            $this->isNumber($request->recalculatedTrip->newPrice,
                'O campo newPrice está inválido');
        }

        $this->customerVerifyLastTrip($request->userId ?? '');

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateNewKnobTrip($request)
    {
        if (count(get_object_vars($request)) < 1)
            throw new RequestValidatorException(1100);

//        $this->cityIdIsValid($request->cityId ?? '');
        $this->tripTypeIdIsValid($request->tripTypeId ?? '');
        $this->driverIdIsValid($request->driverId ?? '');

        return true;
    }

    /**
     * @param $cityId
     * @throws TripException
     */
    protected function cityIdIsValid($cityId)
    {
        if (strlen($cityId) < 1)
            throw new TripException(204);
    }

    /**
     * @param $tripTypeId
     * @throws TripException
     */
    protected function tripTypeIdIsValid($tripTypeId)
    {
        if (strlen($tripTypeId) < 1)
            throw new TripException(205);
    }

    /**
     * @param $driverId
     * @throws TripException
     */
    private function driverIdIsValid($driverId)
    {
        if (strlen($driverId) < 1)
            throw new TripException(206);
    }

    /**
     * @param $name
     * @throws TripException
     */
    private function nameCustomerIsValid($name)
    {
        if (strlen($name) < 1)
            throw new TripException(211);
    }

    /**
     * @param $phone
     * @throws TripException
     */
    private function phoneCustomerIsValid($phone)
    {
        if (strlen($phone) < 1)
            throw new TripException(212);
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    private function customerVerifyLastTrip($userId)
    {
        $tripService = new TripService();
        $trip = $tripService->findLastTripByUser($userId);

        if (isset($trip->date)) {
            if (in_array($trip->status, Trip::getFinalizedStatuses())) {
                return;
            }
    
            $now = new \DateTime();
            $lastTrip = new \DateTime($trip->date);

            $nowTimestamp = $now->getTimestamp();
            $lastTripTimestamp = $lastTrip->getTimestamp();

            if (($nowTimestamp - $lastTripTimestamp) < 10) {
                throw new TripException(200);
            }
        }
    }

    /**
     * @param array|null $waypoints
     * @param int|null   $cityId
     * @throws TripException código 213
     */
    public function waypointsLimitIsValid(?array $waypoints, $cityId): void
    {
        if (empty($waypoints) || empty($cityId)) return;

        $cityConfig = (new CityConfigDao)->getByCity($cityId);
        if (!$cityConfig) return;

        $limit = (int) ($cityConfig->quantityTripWayPoints ?? PHP_INT_MAX);
        if (count($waypoints) > $limit)
            throw new TripException(213, ['waypointsNumber' => count($waypoints)]);
    }
}