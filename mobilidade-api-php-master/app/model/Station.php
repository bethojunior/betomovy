<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 13/07/2018
 * Time: 10:26
 */
class Station extends BaseModel
{
    protected $idStation;
    protected $name;
    protected $stationTypeId;
    protected $statusId;
    protected $cityId;
    protected $latitude;
    protected $longitude;
    protected $address;
    protected $official;
    protected $created_at;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdStation()
    {
        return $this->idStation;
    }

    /**
     * @param mixed $idStation
     * @return Station
     */
    public function setIdStation($idStation)
    {
        $this->idStation = $idStation;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     * @return Station
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStationTypeId()
    {
        return $this->stationTypeId;
    }

    /**
     * @param mixed $stationTypeId
     * @return Station
     */
    public function setStationTypeId($stationTypeId)
    {
        $this->stationTypeId = $stationTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatusId()
    {
        return $this->statusId;
    }

    /**
     * @param mixed $statusId
     * @return Station
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCityId()
    {
        return $this->cityId;
    }

    /**
     * @param mixed $cityId
     * @return Station
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLatitude()
    {
        return $this->latitude;
    }

    /**
     * @param mixed $latitude
     * @return Station
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLongitude()
    {
        return $this->longitude;
    }

    /**
     * @param mixed $longitude
     * @return Station
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * @param mixed $address
     * @return Station
     */
    public function setAddress($address)
    {
        $this->address = $address;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOfficial()
    {
        return $this->official;
    }

    /**
     * @param mixed $official
     * @return Station
     */
    public function setOfficial($official)
    {
        $this->official = $official;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param false|string $created_at
     * @return Station
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

}