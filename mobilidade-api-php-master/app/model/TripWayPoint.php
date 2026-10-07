<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/02/2019
 * Time: 11:01
 */
class TripWayPoint extends BaseModel
{
    protected $id;
    protected $tripReference;
    protected $latitude;
    protected $longitude;
    protected $address;
    protected $cityId;
    protected $neighborhood;
    protected $obs;
    protected $tag;
    protected $confirmed;
    protected $routePitStopTypeId;
    protected $created_at;

    protected $primaryKey = 'id';

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id): void
    {
        $this->id = $id;
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
     */
    public function setTripReference($tripReference): void
    {
        $this->tripReference = $tripReference;
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
     */
    public function setLatitude($latitude): void
    {
        $this->latitude = $latitude;
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
     */
    public function setLongitude($longitude): void
    {
        $this->longitude = $longitude;
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
     */
    public function setAddress($address): void
    {
        $this->address = $address;
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
     */
    public function setCityId($cityId): void
    {
        $this->cityId = $cityId;
    }

    /**
     * @return mixed
     */
    public function getNeighborhood()
    {
        return $this->neighborhood;
    }

    /**
     * @param mixed $neighborhood
     */
    public function setNeighborhood($neighborhood): void
    {
        $this->neighborhood = $neighborhood;
    }

    /**
     * @return mixed
     */
    public function getRoutePitStopTypeId()
    {
        return $this->routePitStopTypeId;
    }

    /**
     * @param mixed $routePitStopTypeId
     * @return TripWayPoint
     */
    public function setRoutePitStopTypeId($routePitStopTypeId)
    {
        $this->routePitStopTypeId = $routePitStopTypeId;
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
     */
    public function setCreatedAt($created_at): void
    {
        $this->created_at = $created_at;
    }

    /**
     * @return mixed
     */
    public function getConfirmed()
    {
        return $this->confirmed;
    }

    /**
     * @param mixed $confirmed
     * @return TripWayPoint
     */
    public function setConfirmed($confirmed)
    {
        $this->confirmed = $confirmed;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTag()
    {
        return $this->tag;
    }

    /**
     * @param mixed $tag
     * @return TripWayPoint
     */
    public function setTag($tag)
    {
        $this->tag = $tag;
        return $this;
    }


}