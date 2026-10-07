<?php

namespace App\Helpers;

use App\Models\Central\Central;
use App\Repositories\Locale\CityRepository;
use Illuminate\Http\Request;

class CityIdHelper
{
    public static function parseFromRequest(Request $request): ?int
    {
        $cityIdHeader = $request->header('cityid') ?? $request->header('cityId');
        $cityId = trim($cityIdHeader ?? '', '; ');
        
        return $cityId !== '' ? (int) $cityId : null;
    }

    public static function inferFromCentral(Central $central, CityRepository $cityRepository): ?int
    {
        if (!$central->latitude || !$central->longitude) {
            return null;
        }

        $city = $cityRepository->findByCoordinate($central->latitude, $central->longitude);
        
        return $city ? $city->id : null;
    }
}
