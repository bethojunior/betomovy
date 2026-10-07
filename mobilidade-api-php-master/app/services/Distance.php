<?php

namespace app\services;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 10/09/2018
 * Time: 11:14
 */
class Distance
{
    private $origin_lat;
    private $origin_long;
    private $destiny_lat;
    private $destiny_long;

    public function __construct($origin_lat = null,
                                $origin_long = null,
                                $destiny_lat = null,
                                $destiny_long = null)
    {
        $this->origin_lat = $origin_lat;
        $this->origin_long = $origin_long;
        $this->destiny_lat = $destiny_lat;
        $this->destiny_long = $destiny_long;
    }

    /**
     * @param mixed $origin_lat
     * @return Distance
     */
    public function setOriginLat($origin_lat)
    {
        $this->origin_lat = $origin_lat;
        return $this;
    }

    /**
     * @param mixed $origin_long
     * @return Distance
     */
    public function setOriginLong($origin_long)
    {
        $this->origin_long = $origin_long;
        return $this;
    }

    /**
     * @param mixed $destiny_lat
     * @return Distance
     */
    public function setDestinyLat($destiny_lat)
    {
        $this->destiny_lat = $destiny_lat;
        return $this;
    }

    /**
     * @param mixed $destiny_long
     * @return Distance
     */
    public function setDestinyLong($destiny_long)
    {
        $this->destiny_long = $destiny_long;
        return $this;
    }

    /**
     * @param bool $inKm
     * @return float|int
     * @throws Exception
     */
    public function getDistance($inKm = false)
    {
        return $this->calculateDistance($inKm);
    }

    /**
     * Calculates the distance between two points in meters or km
     * @param bool $inKm
     * @return float|int
     * @throws Exception
     */
    private function calculateDistance($inKm = false)
    {
        $this->coordinatesIsValid();

        $distance = 6371 * acos(
                cos(deg2rad($this->origin_lat))
                * cos(deg2rad($this->destiny_lat))
                * cos(deg2rad($this->destiny_long) - deg2rad($this->origin_long))
                + sin(deg2rad($this->origin_lat))
                * sin(deg2rad($this->destiny_lat))
            );

        if ($inKm)
            return $distance;

        return $distance * 1000;
    }

    /**
     * @throws Exception
     */
    private function coordinatesIsValid()
    {
        if (!$this->origin_lat ||
            !$this->origin_long ||
            !$this->destiny_lat || !$this->destiny_long)
            throw new Exception("Calculo não pode ter coordenadas vazias");
    }
}