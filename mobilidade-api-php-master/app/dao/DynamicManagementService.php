<?php

namespace app\dao;

use app\services\PriceDynamicService;
use app\model\Location;
use app\model\Price;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/05/2019
 * Time: 15:08
 */
class DynamicManagementService
{
    private $priceDynamicService;
    private $dynamicScheduled;

    public function __construct()
    {
        $this->priceDynamicService = new PriceDynamicService;
    }

    /**
     * @param Location $startLocation
     * @param Price $price
     * @return array
     */
    public function getMultiplier(Location $startLocation, Price $price)
    {
        $multiplierScheduled = $this->getMultiplierPriceDynamicScheduled($price);

        $multiplierAutomatic = $this->priceDynamicService
            ->getMultiplierByDriversClose($startLocation, $price);

        $multiplier = !$multiplierScheduled ?
            ($multiplierAutomatic ?? null) :
            (
            ($multiplierScheduled > $multiplierAutomatic) ?
                $multiplierScheduled : ($multiplierAutomatic ?? null)
            );

        return [
            'multiplier' => $multiplier,
            'tag' => $this->getDynamicTag($price),
        ];
    }

    /**
     * @param \app\model\Price $price
     * @return float|null
     */
    private function getMultiplierPriceDynamicScheduled(Price $price)
    {
        if (isset($this->dynamicScheduled) && !empty($this->dynamicScheduled))
            return $this->dynamicScheduled->multiplierValue;

        $this->dynamicScheduled = $this->priceDynamicService
            ->getCityMultiplierValueByTripType($price->getCityId(), $price->getTripTypeId());

        if (!$this->dynamicScheduled)
            return null;

        return $this->dynamicScheduled->multiplierValue;
    }

    /**
     * @param Price $price
     * @return float|null
     */
    private function getDynamicTag(Price $price)
    {
        if (isset($this->dynamicScheduled) && !empty($this->dynamicScheduled))
            return $this->dynamicScheduled->tag;

        $this->dynamicScheduled = $this->priceDynamicService
            ->getCityMultiplierValueByTripType($price->getCityId(), $price->getTripTypeId());

        if (!$this->dynamicScheduled)
            return null;

        return $this->dynamicScheduled->tag;
    }
}