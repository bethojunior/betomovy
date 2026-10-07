<?php

namespace app\services;

use app\dao\CityConfigDao;
use app\model\Config;

class NegativeBalanceLimitService
{
    private $cityConfigDao;

    public function __construct()
    {
        $this->cityConfigDao = new CityConfigDao;
    }

    public function getByCityId($cityId): float
    {
        if ($cityId) {
            $cityConfig = $this->cityConfigDao->getByCity($cityId);

            if ($cityConfig) {
                $cityValue = $cityConfig->maximumAmountNegativeBalanceDriver;

                if ($cityValue !== null && $cityValue !== '') {
                    return (float)$cityValue;
                }
            }
        }

        return (float)Config::get('max_amount_for_receipt_in_vehicle');
    }
}
