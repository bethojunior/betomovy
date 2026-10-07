<?php

namespace app\utils;

use app\dtos\TripCallPushDTO;
use app\model\Config;

/**
 * Monta título/corpo do push de chamado de corrida (valor, categoria e distância).
 */
class TripCallNotificationBuilder
{
    private const DEFAULT_TITLE = 'CHAMAMENTO EM BREVE';
    private const DEFAULT_CATEGORY = 'App';
    private const DEFAULT_CURRENCY_SYMBOL = 'R$';

    private MapUtils $mapUtils;

    public function __construct()
    {
        $this->mapUtils = new MapUtils();
    }

    public function buildTitle(): string
    {
        return strtoupper($this->resolveAppTitle() ?: self::DEFAULT_TITLE);
    }

    public function buildBody(?TripCallPushDTO $tripCallData, string $fallbackMessage): string
    {
        if (!$tripCallData || $tripCallData->getPrice() === null) {
            return $fallbackMessage;
        }

        $category = $tripCallData->getVehicleCategory() ?: ($this->resolveAppTitle() ?: self::DEFAULT_CATEGORY);
        $currencySymbol = Config::get('application_currency') ?: self::DEFAULT_CURRENCY_SYMBOL;

        $body = $category . ' · ' . $currencySymbol . FormatValue::formatForReal($tripCallData->getPrice());

        $proximityKm = $tripCallData->getProximityKm();
        $estimatedMinutes = $this->mapUtils->estimateArrivalMinutes($proximityKm);
        if ($estimatedMinutes !== null) {
            $body .= "\n{$estimatedMinutes} min (" . number_format($proximityKm, 1, ',', '.') . ' km) de distância';
        }

        return $body;
    }

    private function resolveAppTitle(): ?string
    {
        return Config::get('app_title') ?: (env('APP_NAME') ?: null);
    }
}
