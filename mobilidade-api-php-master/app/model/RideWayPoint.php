<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/05/2020
 * Time: 15:50
 */
class RideWayPoint extends BaseModel
{
    protected $id;
    protected $rideId;
    protected $riderTripCustomerId;
    protected $routePitStopTypeId;
    protected $address;
    protected $latitude;
    protected $longitude;
    protected $created_at;
    protected $updated_at;

    protected $primaryKey = 'id';

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);

        $this->updated_at = now();
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
     * @return RideWayPoint
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRideId()
    {
        return $this->rideId;
    }

    /**
     * @param mixed $rideId
     * @return RideWayPoint
     */
    public function setRideId($rideId)
    {
        $this->rideId = $rideId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRiderTripCustomerId()
    {
        return $this->riderTripCustomerId;
    }

    /**
     * @param mixed $riderTripCustomerId
     * @return RideWayPoint
     */
    public function setRiderTripCustomerId($riderTripCustomerId)
    {
        $this->riderTripCustomerId = $riderTripCustomerId;
        return $this;
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
     * @return RideWayPoint
     */
    public function setRoutePitStopTypeId($routePitStopTypeId)
    {
        $this->routePitStopTypeId = $routePitStopTypeId;
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
     * @return RideWayPoint
     */
    public function setAddress($address)
    {
        $this->address = $address;
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
     * @return RideWayPoint
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
     * @return RideWayPoint
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;
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
     * @return RideWayPoint
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param false|string $updated_at
     * @return RideWayPoint
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

}