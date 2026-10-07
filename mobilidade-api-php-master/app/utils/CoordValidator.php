<?php

namespace app\utils;

class CoordValidator
{
    public static function isValidLatitude(string $value): bool
    {
        return is_numeric($value) && (float)$value >= -90 && (float)$value <= 90;
    }

    public static function isValidLongitude(string $value): bool
    {
        return is_numeric($value) && (float)$value >= -180 && (float)$value <= 180;
    }

    public static function isValid(string $coord): bool
    {
        $parts = explode(',', $coord);

        if (count($parts) !== 2) return false;

        [$lat, $lon] = $parts;

        return self::isValidLatitude($lat) && self::isValidLongitude($lon);
    }
}
