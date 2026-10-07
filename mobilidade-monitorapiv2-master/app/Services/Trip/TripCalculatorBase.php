<?php

namespace App\Services\Trip;

abstract class TripCalculatorBase
{
    /** @var int Velocidade média estimada em áreas urbanas em km/h. */
    protected const AVERAGE_URBAN_SPEED_KMH = 30;
    
    /** @var float Fator de multiplicação para simular o impacto do trânsito no tempo de viagem. */
    protected const TRAFFIC_FACTOR = 1.5;
    
    /** @var float Fator de correção para estimativas do Google Maps, que tendem a ser superestimadas. */
    protected const GOOGLE_MAPS_CORRECTION_FACTOR = 0.65;
    
    /** @var int Raio da Terra em quilômetros, usado na fórmula de Haversine. */
    protected const EARTH_RADIUS_KM = 6371;
    
    /** @var int Número de minutos em uma hora. */
    protected const MINUTES_PER_HOUR = 60;

    /**
     * Fórmula de Haversine - calcula distância em km considerando curvatura da Terra
     */
    protected static function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return self::EARTH_RADIUS_KM * $c;
    }

    protected static function convertDistanceToMinutes(float $distanceKm): float
    {
        return ($distanceKm / self::AVERAGE_URBAN_SPEED_KMH) * self::MINUTES_PER_HOUR * self::TRAFFIC_FACTOR;
    }

    protected static function convertGoogleEstimateToMinutes(int $estimatedTripTime): float
    {
        return ($estimatedTripTime / self::MINUTES_PER_HOUR) * self::GOOGLE_MAPS_CORRECTION_FACTOR;
    }
}

