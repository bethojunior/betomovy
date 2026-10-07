<?php

namespace app\services;

use app\dao\DynamicAreaDao;
use app\utils\Polygon;

class DynamicAreaService
{
    public function findAllByPosition($lat, $lng, $time = null)
    {
        $results = (new DynamicAreaDao)->findAllByPosition($lat, $lng, $time);

        return array_map(function ($item) {
            $item->area = Polygon::polygonToArray($item->area);
            return $item;
        }, $results);
    }
}