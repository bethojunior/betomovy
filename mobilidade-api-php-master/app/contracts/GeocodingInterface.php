<?php

namespace app\contracts;
use app\model\Geocoder;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/10/2019
 * Time: 08:46
 */
interface GeocodingInterface
{
    public function search($query, $isCoordinate = false, bool $retry = false): Geocoder;


    public function getApiKey(): string;
}