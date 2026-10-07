<?php

namespace app\utils;

use stdClass;

/**
 * Estimativas de distância/tempo até o motorista a partir da proximidade em
 * linha reta (km) já calculada na seleção do motorista - sem chamar API
 * externa de mapas.
 */
class MapUtils
{
    private const AVERAGE_DRIVER_SPEED_KMH = 25.0;

    public function estimateArrivalMinutes(?float $proximityKm): ?int
    {
        if ($proximityKm === null) {
            return null;
        }

        return (int)round(($proximityKm / self::AVERAGE_DRIVER_SPEED_KMH) * 60);
    }

    public function estimateArrivalSeconds(?float $proximityKm): ?int
    {
        $estimatedMinutes = $this->estimateArrivalMinutes($proximityKm);

        return $estimatedMinutes === null ? null : $estimatedMinutes * 60;
    }

    public function proximityMeters(?float $proximityKm): ?int
    {
        return $proximityKm === null ? null : (int)round($proximityKm * 1000);
    }

    /**
     * Formatação de texto compartilhada com os providers de mapa
     * (HereDistanceApi, MapBoxApi, GoogleMapsApi) - mesmo texto,
     * independente de vir de rota real ou de estimativa por proximidade.
     * @param float $meters
     * @return string
     */
    public function formatDistanceText(float $meters): string
    {
        return round($meters / 1000, 1) . ' km';
    }

    /**
     * @param float $seconds
     * @return string
     */
    public function formatDurationText(float $seconds): string
    {
        return round($seconds / 60) . ' mins';
    }

    /**
     * Mesmo formato que a API de mapas retornava (distance/duration com
     * text+value, value em metros/segundos).
     * @param float|null $proximityKm
     * @return stdClass
     */
    public function buildEstimative(?float $proximityKm): stdClass
    {
        $proximityKm = (float)($proximityKm ?? 0);
        $distanceMeters = $this->proximityMeters($proximityKm);
        $durationSeconds = $this->estimateArrivalSeconds($proximityKm);

        $estimative = new stdClass();
        $estimative->distance = (object)[
            'text' => $this->formatDistanceText($distanceMeters),
            'value' => $distanceMeters,
        ];
        $estimative->duration = (object)[
            'text' => $this->formatDurationText($durationSeconds),
            'value' => $durationSeconds,
        ];

        return $estimative;
    }
}
