<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/11/2018
 * Time: 09:49
 */
class TripEco extends BaseModel
{
    protected $idTripEco;
    protected $distanceFromAcceptToDestination;
    protected $distanceFromDestinationToDriverReturn;
    protected $ecoKm;
    protected $co2Economized;
    protected $co2ShouldSpent;
    protected $tripReference;

    protected $table = "tripEco";

    /**
     * @return mixed
     */
    public function getIdTripEco()
    {
        return $this->idTripEco;
    }

    /**
     * @param mixed $idTripEco
     * @return TripEco
     */
    public function setIdTripEco($idTripEco)
    {
        $this->idTripEco = $idTripEco;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDistanceFromAcceptToDestination()
    {
        return $this->distanceFromAcceptToDestination;
    }

    /**
     * @param mixed $distanceFromAcceptToDestination
     * @return TripEco
     */
    public function setDistanceFromAcceptToDestination($distanceFromAcceptToDestination)
    {
        $this->distanceFromAcceptToDestination = $distanceFromAcceptToDestination;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDistanceFromDestinationToDriverReturn()
    {
        return $this->distanceFromDestinationToDriverReturn;
    }

    /**
     * @param mixed $distanceFromDestinationToDriverReturn
     * @return TripEco
     */
    public function setDistanceFromDestinationToDriverReturn($distanceFromDestinationToDriverReturn)
    {
        $this->distanceFromDestinationToDriverReturn = $distanceFromDestinationToDriverReturn;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEcoKm()
    {
        return $this->ecoKm;
    }

    /**
     * @param mixed $ecoKm
     * @return TripEco
     */
    public function setEcoKm($ecoKm)
    {
        $this->ecoKm = $ecoKm;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCo2Economized()
    {
        return $this->co2Economized;
    }

    /**
     * @param mixed $co2Economized
     * @return TripEco
     */
    public function setCo2Economized($co2Economized)
    {
        $this->co2Economized = $co2Economized;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCo2ShouldSpent()
    {
        return $this->co2ShouldSpent;
    }

    /**
     * @param mixed $co2ShouldSpent
     * @return TripEco
     */
    public function setCo2ShouldSpent($co2ShouldSpent)
    {
        $this->co2ShouldSpent = $co2ShouldSpent;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripReference()
    {
        return $this->tripReference;
    }

    /**
     * @param mixed $tripReference
     * @return TripEco
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

}