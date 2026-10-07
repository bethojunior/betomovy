<?php

namespace app\utils;

class GeoDistanceCalculator
{
    private const EARTH_RADIUS_METERS = 6371000;

    public static function metersBetween(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $lat1Rad = deg2rad($lat1);
        $lat2Rad = deg2rad($lat2);
    
        $latDelta = $lat2Rad - $lat1Rad;
        $lonDelta = deg2rad($lon2 - $lon1);
    
        $a = sin($latDelta / 2) ** 2
            + cos($lat1Rad)
            * cos($lat2Rad)
            * sin($lonDelta / 2) ** 2;
    
        $a = max(0.0, min(1.0, $a));
    
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    
        return self::EARTH_RADIUS_METERS * $c;
    }
}
