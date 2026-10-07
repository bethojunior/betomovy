<?php

namespace app\services;

use app\dao\RiskAreaDao;

class RiskAreaVerificationService
{
    private $riskAreaDao;
    private $defaultRadiusKm;

    public function __construct($riskAreaDao = null, $defaultRadiusKm = 0.5)
    {
        $this->riskAreaDao = $riskAreaDao ?? new RiskAreaDao();
        $this->defaultRadiusKm = $defaultRadiusKm;
    }

    public function isInRiskArea($latitude, $longitude, $cityId = null)
    {
        return $this->riskAreaDao->isCoordinateInRiskArea(
            $latitude,
            $longitude,
            $this->defaultRadiusKm,
            $cityId
        );
    }

    public function verifyTripRiskAreas($originLat, $originLon, $destLat, $destLon, $cityId = null)
    {
        return (object)[
            'origin' => $this->isInRiskArea($originLat, $originLon, $cityId),
            'destination' => $this->isInRiskArea($destLat, $destLon, $cityId)
        ];
    }
}
