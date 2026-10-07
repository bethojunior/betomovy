<?php

namespace App\Services\Trip;

use DateTime;

class TripProgressCalculator extends TripCalculatorBase
{
    private const MIN_TRIP_TIME_MINUTES = 2;
    private const MAX_TRIP_TIME_MINUTES = 15;

    public static function calculate($trip): float
    {
        if (isset($trip->status) && $trip->status === 'finished') {
            return 100.0;
        }

        if (!isset($trip->status) || $trip->status !== 'in_progress') {
            return 0.0;
        }

        if (!isset($trip->date) || empty($trip->date)) {
            return 0.0;
        }

        try {
            // Se tem localização do motorista, calcula por distância percorrida
            if (isset($trip->last_lat) && isset($trip->last_lon) &&
                isset($trip->originLatitude) && isset($trip->originLongitude) &&
                isset($trip->destinationLatitude) && isset($trip->destinationLongitude)) {
                
                return self::calculateProgressByDistance($trip);
            }
            
            // Fallback: calcula por tempo decorrido
            return self::calculateProgressByTime($trip);

        } catch (\Exception $e) {
            return 0.0;
        }
    }
    
    private static function calculateProgressByDistance($trip): float
    {
        $totalDistance = self::calculateDistance(
            floatval($trip->originLatitude),
            floatval($trip->originLongitude),
            floatval($trip->destinationLatitude),
            floatval($trip->destinationLongitude)
        );
        
        $remainingDistance = self::calculateDistance(
            floatval($trip->last_lat),
            floatval($trip->last_lon),
            floatval($trip->destinationLatitude),
            floatval($trip->destinationLongitude)
        );
        
        // Progresso = (distância percorrida / distância total) * 100
        $distanceTraveled = $totalDistance - $remainingDistance;
        $progress = ($distanceTraveled / $totalDistance) * 100;
        
        // Aplica curva não-linear
        $distanceRatio = $distanceTraveled / $totalDistance;
        $progress = self::calculateProgressWithCurve($distanceRatio);
        
        return round(max(0, min(100, $progress)), 2);
    }
    
    private static function calculateProgressByTime($trip): float
    {
        $tripStartTime = new DateTime($trip->date);
        $currentTime = new DateTime();
        $elapsedSeconds = $currentTime->getTimestamp() - $tripStartTime->getTimestamp();
        $elapsedMinutes = $elapsedSeconds / 60;

        $totalEstimatedMinutes = self::getEstimatedTripTimeInMinutes($trip);
        $totalEstimatedMinutes = max($totalEstimatedMinutes, self::MIN_TRIP_TIME_MINUTES);
        $totalEstimatedMinutes = min($totalEstimatedMinutes, self::MAX_TRIP_TIME_MINUTES);

        $timeRatio = $elapsedMinutes / $totalEstimatedMinutes;
        $progress = self::calculateProgressWithCurve($timeRatio);

        return round(max(0, min(100, $progress)), 2);
    }

    private static function getEstimatedTripTimeInMinutes($trip): float
    {
        if (isset($trip->estimatedTripTime) && $trip->estimatedTripTime > 0) {
            return self::convertGoogleEstimateToMinutes($trip->estimatedTripTime);
        }

        if (isset($trip->originLatitude) && isset($trip->originLongitude) &&
            isset($trip->destinationLatitude) && isset($trip->destinationLongitude)) {
            
            $distance = self::calculateDistance(
                floatval($trip->originLatitude),
                floatval($trip->originLongitude),
                floatval($trip->destinationLatitude),
                floatval($trip->destinationLongitude)
            );
            
            return self::convertDistanceToMinutes($distance);
        }

        if (isset($trip->distance) && $trip->distance > 0) {
            return self::convertDistanceToMinutes($trip->distance);
        }

        return self::MIN_TRIP_TIME_MINUTES;
    }

    /**
     * Curva não-linear: progresso desacelera gradualmente para não chegar em 100% antes do fim
     * 0-50% tempo → 0-50% progresso | 50-70% → 50-75% | 70-85% → 75-90% | 85-100% → 90-98%
     */
    private static function calculateProgressWithCurve(float $timeRatio): float
    {
        if ($timeRatio <= 0.5) {
            return $timeRatio * 100;
        }
        elseif ($timeRatio <= 0.7) {
            return 50 + (($timeRatio - 0.5) / 0.2) * 25;
        }
        elseif ($timeRatio <= 0.85) {
            return 75 + (($timeRatio - 0.7) / 0.15) * 15;
        }
        elseif ($timeRatio <= 1.0) {
            return 90 + (($timeRatio - 0.85) / 0.15) * 8;
        }
        else {
            return 98 + min(($timeRatio - 1.0) * 10, 2);
        }
    }

}

