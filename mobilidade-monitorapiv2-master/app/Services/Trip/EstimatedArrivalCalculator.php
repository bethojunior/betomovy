<?php

namespace App\Services\Trip;

use Illuminate\Support\Facades\Log;

class EstimatedArrivalCalculator extends TripCalculatorBase
{
    private const MIN_ESTIMATED_TIME_MINUTES = 1;
    private const MAX_ESTIMATED_TIME_MINUTES = 60;
    private const MINIMUM_DISTANCE_KM = 0.1;
    private const DEFAULT_FALLBACK_MINUTES = 5;
    
    /**
     * Calcula o tempo estimado em minutos para o motorista chegar no cliente
     */
    public static function calculate(object $trip): ?int
    {
        if (!isset($trip->status) || 
            !in_array($trip->status, ['accepted', 'boarding'])) {
            return null;
        }

        try {
            if (!isset($trip->last_lat) || !isset($trip->last_lon) ||
                !isset($trip->originLatitude) || !isset($trip->originLongitude)) {
                return self::fallbackEstimate($trip);
            }
            
            $distance = self::calculateDistance(
                floatval($trip->last_lat),
                floatval($trip->last_lon),
                floatval($trip->originLatitude),
                floatval($trip->originLongitude)
            );
            
            if ($distance < self::MINIMUM_DISTANCE_KM) {
                return self::MIN_ESTIMATED_TIME_MINUTES;
            }
            
            return self::convertDistanceToMinutesWithLimits($distance);
            
        } catch (\Exception $e) {
            Log::error('Falha ao calcular o tempo estimado de chegada', [
                'trip_reference' => $trip->tripReference ?? 'N/A',
                'error' => $e->getMessage()
            ]);
            return self::fallbackEstimate($trip);
        }
    }
    
    public static function formatDuration(?int $minutes): ?string
    {
        if ($minutes === null) {
            return null;
        }
        
        $hours = (int) ($minutes / 60);
        $mins = $minutes % 60;
        
        return sprintf('%02d:%02d', $hours, $mins);
    }
    
    private static function fallbackEstimate(object $trip): ?int
    {
        if (isset($trip->distance) && $trip->distance > 0) {
            return self::convertDistanceToMinutesWithLimits($trip->distance);
        }
        
        if (isset($trip->estimatedTripTime) && $trip->estimatedTripTime > 0) {
            $minutes = self::convertGoogleEstimateToMinutes($trip->estimatedTripTime);
            return self::applyTimeLimits($minutes);
        }
        
        return self::DEFAULT_FALLBACK_MINUTES;
    }
    
    protected static function convertDistanceToMinutesWithLimits(float $distanceKm): int
    {
        $estimatedMinutes = self::convertDistanceToMinutes($distanceKm);
        return self::applyTimeLimits($estimatedMinutes);
    }
    
    private static function applyTimeLimits(float $minutes): int
    {
        $minutes = max($minutes, self::MIN_ESTIMATED_TIME_MINUTES);
        $minutes = min($minutes, self::MAX_ESTIMATED_TIME_MINUTES);
        return (int) round($minutes);
    }
}

