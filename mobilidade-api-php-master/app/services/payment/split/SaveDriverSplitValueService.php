<?php

namespace app\services\payment\split;

use app\constant\DriverSplitConfigConst;
use app\constant\DriverSplitValueConst;
use app\dao\DriverSplitConfigDao;
use app\dao\DriverSplitValueDao;
use app\model\Config;
use app\model\DriverSplitValue;
use app\model\Trip;
use app\model\TripAudit;
use app\utils\BaseModel;
use Exception;

class SaveDriverSplitValueService
{
    private DriverSplitValueDao $driverSplitValueDao;
    private DriverSplitConfigDao $driverSplitConfigDao;

    public function __construct()
    {
        $this->driverSplitValueDao = new DriverSplitValueDao();
        $this->driverSplitConfigDao = new DriverSplitConfigDao();
    }

    /**
     * @throws Exception
     */
    public function saveOrUpdateIfSplitEnabled(Trip $trip, float $valueToSplit): bool
    {
        $validated = $this->validateSplitEnabled($trip);

        if (!$validated) {
            return false;
        }

        $driverSplitValue = $this->driverSplitValueDao->findByTripAndDriver($trip->getIdTrip(), $trip->getDriverId());
        $valueToSplit = $valueToSplit * 100; // convert to cents

        if ($driverSplitValue) {
            $method = $valueToSplit < 0 ? 'decrementsAmount' : 'incrementsAmount';
            $this->driverSplitValueDao->$method($driverSplitValue->id, $valueToSplit);

            return true;
        }

        $this->createDriverSplitValue($trip, $valueToSplit);

        return true;
    }

    private function createDriverSplitValue(Trip $trip, float $valueToSplit): void
    {
        $driverSplitValue = new DriverSplitValue;
        $driverSplitValue->setDriverId($trip->getDriverId());
        $driverSplitValue->setTripId($trip->getIdTrip());
        $driverSplitValue->setAmount($valueToSplit); // convert to cents
        $driverSplitValue->setStatus(DriverSplitValueConst::STATUS_PENDING);

        $this->driverSplitValueDao->create($driverSplitValue);
    }

    /**
     * @param Trip $trip
     * @return bool
     */
    private function validateSplitEnabled(Trip $trip): bool
    {
        if ($trip->getTripAuditId() != TripAudit::RELEASED) {
            return false;
        }

        $generalSplitConfig = (bool) Config::get('enable_driver_split_payment');
        if (!$generalSplitConfig) {
            return false;
        }

        $driverSplitConfig = $this->driverSplitConfigDao->findActiveByDriver($trip->getDriverId());
        if (!$driverSplitConfig) {
            return false;
        }

        if ($driverSplitConfig->status !== DriverSplitConfigConst::STATUS_ACTIVE) {
            return false;
        }

        return true;
    }
}