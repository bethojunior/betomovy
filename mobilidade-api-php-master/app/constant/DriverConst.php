<?php

namespace app\constant;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/10/2018
 * Time: 09:20
 */
class DriverConst
{
    const LIMIT_STATIONS = 3;
    const MIN_STATIONS = 1;

    const PUSH_TITLE_ON_DRIVER_ARRIVAL = "SEU MOTORISTA CHEGOU";
    const PUSH_MESSAGE_ON_DRIVER_ARRIVAL = "{driverName} está lhe aguardando";

    public static function driverPictureProfileDir($compressed = true)
    {
        $base = env('S3_URL') . env('S3_BUCKET_NAME') . "/driver/profile/";
        return $compressed ? $base . 'compressed/' : $base;
    }
}