<?php

namespace app\utils;
use stdClass;

class Polygon
{
    /**
     * @param array $polygon
     * @return string
     */
    public static function polygonToString(array $polygon): string
    {
        $filteredArray = array_map(function ($point) {
            return $point['lat'] . " " . $point['lng'];
        }, $polygon);

        return "'POLYGON((" . implode(',', $filteredArray) . "))'";
    }

    public static function polygonToArray(string $polygon)
    {
        $polygon = str_replace(["(", "POLYGON", ")", "'"], '', $polygon);
        $polygon = explode(',', $polygon);

        return array_map(function ($coordinate) {
            $point = new stdClass;
            $coordinate = explode(" ", $coordinate);

            $point->lat = (float)$coordinate[0];
            $point->lng = (float)$coordinate[1];

            return $point;
        }, $polygon);
    }

}