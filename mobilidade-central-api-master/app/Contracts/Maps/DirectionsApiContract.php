<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/03/2020
 * Time: 14:36
 */

namespace App\Contracts\Maps;


interface DirectionsApiContract
{
    public function getDistance(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null);

    public function getDistanceWithFullAddress(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude);
}
