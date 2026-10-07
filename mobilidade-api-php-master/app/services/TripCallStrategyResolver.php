<?php

namespace app\services;

use app\dao\CityConfigDao;
use app\model\Origin;

class TripCallStrategyResolver
{
    private $cityConfigDao;

    public function __construct()
    {
        $this->cityConfigDao = new CityConfigDao;
    }

    public function shouldUseFastFingerByCityConfig(Origin $origin): bool
    {
        $cityConfig = $this->cityConfigDao
            ->getByCoordinate($origin->getLatitude(), $origin->getLongitude());

        if (!isset($cityConfig) || !isset($cityConfig->quantityDriversCloseOnCall))
            return false;

        if (!is_numeric($cityConfig->quantityDriversCloseOnCall))
            return false;

        return (int)$cityConfig->quantityDriversCloseOnCall === 0;
    }
}
