<?php

namespace app\contracts;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/08/2019
 * Time: 16:57
 */
interface DirectionsApiInterface
{
    public function getDistance(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null, bool $retry = false);

    public function getDistanceWithFullAddress(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, bool $retry = false);


    public function getApiKey(): string;
}