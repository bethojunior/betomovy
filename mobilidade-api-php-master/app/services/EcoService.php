<?php

namespace app\services;

use app\constant\TripEventConst;
use app\dao\DriverEventDao;
use app\dao\StationDao;
use app\utils\Co2;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/11/2018
 * Time: 13:29
 */
class EcoService
{
    private $distanceCalculator;

    public function __construct()
    {
        $this->distanceCalculator = new Distance;
    }

    /**
     * @param $tripReference
     * @return array|null
     * @throws Exception
     */
    public function calculateTripEco($tripReference)
    {
        $driverEvent = (new DriverEventDao)->getTripEvent($tripReference, TripEventConst::DRIVER_ACCEPTED);

        if (!$driverEvent)
            return null;

        $destination = $driverEvent->data->destination;
        $origin = $driverEvent->data->origin;

        $driverLocationInAccept = $driverEvent->data->driver;
        $driverReturn = (new StationDao)
            ->find($driverLocationInAccept->stationId);

        $distanceFromAcceptToDestination = $this->calculateDistanceFromAcceptToOrigin($driverLocationInAccept->location, $origin);
        $distanceFromAcceptToDestination += $this->calculateDistanceFromOriginToDestination($origin, $destination);
        $distanceFromDestinationToDriverReturn = $this->calculateDistanceFromDestinationToDriverReturn($driverReturn, $destination);

        $ecoKm = $distanceFromAcceptToDestination - $distanceFromDestinationToDriverReturn;

        return [
            'distanceFromAcceptToDestination' => $distanceFromAcceptToDestination,
            'distanceFromDestinationToDriverReturn' => $distanceFromDestinationToDriverReturn,
            'ecoKm' => $ecoKm < 0 ? 0 : $ecoKm,
            'co2Economized' => $ecoKm > 0 ? Co2::calculateKgByKm($ecoKm) : 0,
            'co2ShouldSpent' => Co2::calculateKgByKm($distanceFromAcceptToDestination)
        ];
    }

    /**
     * Calcular a distancia entre o local que o motorista aceitou a corrida
     * até a origem da corrida
     * @param $driverLocationOnAccept
     * @param $origin
     * @return float|int
     * @throws Exception
     */
    private function calculateDistanceFromAcceptToOrigin($driverLocationOnAccept, $origin)
    {
        $this->distanceCalculator
            ->setOriginLat($driverLocationOnAccept->latitude)
            ->setOriginLong($driverLocationOnAccept->longitude)
            ->setDestinyLat($origin->latitude)
            ->setDestinyLong($origin->longitude);

        return $this->distanceCalculator->getDistance(true);
    }

    /**
     * Calcula a distancia entre o local de origem da corrida
     * até o destino da corrida
     * @param $origin
     * @param $destination
     * @return float|int
     * @throws Exception
     */
    private function calculateDistanceFromOriginToDestination($origin, $destination)
    {
        $this->distanceCalculator
            ->setOriginLat($origin->latitude)
            ->setOriginLong($origin->longitude)
            ->setDestinyLat($destination->latitude)
            ->setDestinyLong($destination->longitude);

        return $this->distanceCalculator->getDistance(true);
    }

    /**
     * Calcula a distancia entre o destino da viagem
     * até o posto de retorno do motorista
     * @param $driverReturn
     * @param $destination
     * @return float|int
     * @throws Exception
     */
    private function calculateDistanceFromDestinationToDriverReturn($driverReturn, $destination)
    {
        $this->distanceCalculator
            ->setOriginLat($driverReturn->latitude)
            ->setOriginLong($driverReturn->longitude)
            ->setDestinyLat($destination->latitude)
            ->setDestinyLong($destination->longitude);

        return $this->distanceCalculator->getDistance(true);
    }
}