<?php

namespace app\services;
use app\dao\NearbyDriversDao;
use app\dao\PriceDynamicDao;
use app\dao\PriceDynamicScheduledDao;
use app\model\Location;
use app\model\Price;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 14:47
 */
class PriceDynamicService
{
    private $dao;
    private $scheduledDao;
    private $nearbyDriversDao;

    public function __construct()
    {
        $this->dao = new PriceDynamicDao;
        $this->scheduledDao = new PriceDynamicScheduledDao;
        $this->nearbyDriversDao = new NearbyDriversDao;
    }

    /**
     * Retorna o valor do multiplicador de preço
     * baseado no dia, horário e cidade
     * @param $cityId
     * @return float|null
     */
    public function getCityMultiplierValue($cityId)
    {
        $dynamic = $this->dao
            ->findActiveInCity($cityId);

        if ($dynamic)
            return (float)$dynamic->multiplierValue;

        return null;
    }

    /**
     * @param $cityId
     * @param $tripTypeId
     * @return array|mixed|null
     */
    public function getCityMultiplierValueByTripType($cityId, $tripTypeId)
    {
        $dynamic = $this->scheduledDao
            ->findActiveInCity($cityId, $tripTypeId);

        if ($dynamic)
            return $dynamic;

        return null;
    }

    /**
     * @param Location $origin
     * @param \app\model\Price $price
     * @return float|null
     */
    public function getMultiplierByDriversClose(Location $origin, Price $price)
    {
        $nearbyDrivers = $this->nearbyDriversDao
            ->quantityDriversClose(
                $origin->getLatitude(),
                $origin->getLongitude(),
                $price->getTripTypeId()
            );

        $countNearbyDrivers = count($nearbyDrivers);

        if (empty($countNearbyDrivers))
            return null;

        $quantityNearbyDrivers = $price->getIdealListCommonPrice() <= $countNearbyDrivers ?
            $price->getIdealListCommonPrice() : $countNearbyDrivers;

        $multiplier = (((($quantityNearbyDrivers * 100) / $price->getIdealListCommonPrice()) - 100) / -100) + 1;

        return $multiplier > 1 ? (float)$multiplier : null;
    }
}