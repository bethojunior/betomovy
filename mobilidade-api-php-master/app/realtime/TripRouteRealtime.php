<?php

namespace app\realtime;

use app\model\Config;
use app\utils\CloudFirestore;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/07/2019
 * Time: 10:17
 */
class TripRouteRealtime extends CloudFirestore
{
    protected $collection = 'tripRoute';
}