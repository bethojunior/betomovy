<?php

namespace App\Helpers\Trip;

use App\Models\Config\Config;

/**
 * Monta título/corpo do push de chamado de corrida (valor, categoria e distância).
 * Mesmo formato da mobilidade-api-php (app/utils/TripCallNotificationBuilder.php).
 */
class TripCallNotificationBuilder
{
    private const DEFAULT_TITLE = 'CHAMAMENTO EM BREVE';
    private const DEFAULT_CATEGORY = 'App';
    private const DEFAULT_CURRENCY_SYMBOL = 'R$';
    private const AVERAGE_DRIVER_SPEED_KMH = 25.0;

    public function buildTitle(): string
    {
        return strtoupper($this->resolveAppTitle() ?: self::DEFAULT_TITLE);
    }

    /**
     * @param $trip TripDriver|null trip atual (usa ->price e ->type, já vêm prontos da view tripDrivers)
     * @param float|null $proximityKm
     * @param string $fallbackMessage usado quando não há preço (trip sem dado suficiente)
     */
    public function buildBody($trip, ?float $proximityKm, string $fallbackMessage): string
    {
        if (!$trip || !isset($trip->price) || $trip->price === null) {
            return $fallbackMessage;
        }

        $category = $trip->type ?: ($this->resolveAppTitle() ?: self::DEFAULT_CATEGORY);
        $currencySymbol = Config::getConf('application_currency') ?: self::DEFAULT_CURRENCY_SYMBOL;

        $body = $category . ' · ' . $currencySymbol . $this->formatCurrency((float)$trip->price);

        $estimatedMinutes = $this->estimateArrivalMinutes($proximityKm);
        if ($estimatedMinutes !== null) {
            $body .= "\n{$estimatedMinutes} min (" . number_format($proximityKm, 1, ',', '.') . ' km) de distância';
        }

        return $body;
    }

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

    private function formatCurrency(float $value): string
    {
        return number_format($value, 2, ',', '.');
    }

    private function resolveAppTitle(): ?string
    {
        return Config::getConf('app_title') ?: (env('APP_NAME') ?: null);
    }
}
