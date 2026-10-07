<?php

namespace app\constant;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/10/2018
 * Time: 15:54
 */
class TripTypeConst
{
    const RETURN = 1;
    const TAXI_COMUM = 2;
    const PLUS = 3;
    const MOTO = 4;

    const PICTURE_DIR = '/tripType/';

    public static function typeName($typeId)
    {
        switch ($typeId) {
            case self::RETURN:
                return "RETURN";
            case self::TAXI_COMUM:
                return "TAXI COMUM";
            case self::PLUS:
                return "PLUS";
            case self::MOTO:
                return "MOTO";
            default:
                return null;
        }
    }
}