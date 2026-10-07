<?php

namespace app\utils;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/11/2018
 * Time: 17:19
 */
class Co2
{
    const KG_BY_KM = 1.10;

    /**
     * @param $km
     * @return float|int
     */
    public static function calculateKgByKm($km)
    {
        return $km * self::KG_BY_KM;
    }
}