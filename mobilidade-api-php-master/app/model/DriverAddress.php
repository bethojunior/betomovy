<?php

namespace app\model;

use app\utils\BaseModel;

class DriverAddress extends BaseModel
{
    protected $table = "driverAddress";
    protected $driverId;
    protected $street;
    protected $number;
    protected $complement;
    protected $neighborhood;
    protected $city;
    protected $state;
    protected $zipCode;
    protected $created_at;
    protected $updated_at;

    public function __construct($obj = null)
    {
        $this->created_at = now();
        parent::__construct($obj);
    }

    public function getIdDriver()
    {
        return $this->driverId;
    }

    public function setIdDriver($idDriver)
    {
        $this->driverId = $idDriver;
        return $this;
    }

    public function getStreet()
    {
        return $this->street;
    }

    public function setStreet($street)
    {
        $this->street = $street;
        return $this;
    }

    public function getNumber()
    {
        return $this->number;
    }

    public function setNumber($number)
    {
        $this->number= $number;
        return $this;
    }

    public function getComplement()
    {
        return $this->complement;
    }

    public function setComplement($complement)
    {
        $this->complement= $complement;
        return $this;
    }

    public function getNeighborhood()
    {
        return $this->neighborhood;
    }

    public function setNeighborhood($neighborhood)
    {
        $this->neighborhood= $neighborhood;
        return $this;
    }

    public function getCity()
    {
        return $this->city;
    }

    public function setCity($city)
    {
        $this->city= $city;
        return $this;
    }

    public function getState()
    {
        return $this->state;
    }

    public function setState($state)
    {
        $this->state= $state;
        return $this;
    }

    public function getZipCode()
    {
        return $this->zipCode;
    }

    public function setZipCode($zipCode)
    {
        $this->zipCode= $zipCode;
        return $this;
    }

}
