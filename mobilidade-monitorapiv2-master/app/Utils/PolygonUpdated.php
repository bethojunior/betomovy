<?php

namespace App\Utils;

class PolygonUpdated
{

    public static function polygonToStringUpdated(array $polygon): string
    {
        $coords = array_map(function ($point) {
            return "{$point['lng']} {$point['lat']}";
        }, $polygon);

        if ($coords[0] !== end($coords)) {
            $coords[] = $coords[0];
        }

        return "'POLYGON((" . implode(',', $coords) . "))'";
    }

    public static function polygonToArrayUpdated(string $polygon): array
    {
        $polygon = str_replace(['POLYGON', '(', ')', "'"], '', $polygon);
        $coords = explode(',', $polygon);

        return array_map(function ($coord) {
            [$lng, $lat] = array_map('floatval', preg_split('/\s+/', trim($coord)));
            return (object)[
                'lat' => $lat,
                'lng' => $lng,
            ];
        }, $coords);
    }
}
