<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 21:13
 */
class Ride extends BaseModel
{
    protected $id;
    protected $routeId;
    protected $driverId;
    protected $tripReference;
    protected $seatsAvailable;
    protected $routeLayout;
    protected $created_at;
    protected $updated_at;

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
     * @return Ride
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRouteId()
    {
        return $this->routeId;
    }

    /**
     * @param mixed $routeId
     * @return Ride
     */
    public function setRouteId($routeId)
    {
        $this->routeId = $routeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverId()
    {
        return $this->driverId;
    }

    /**
     * @param mixed $driverId
     * @return Ride
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
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
     * @return Ride
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSeatsAvailable()
    {
        return $this->seatsAvailable;
    }

    /**
     * @param mixed $seatsAvailable
     * @return Ride
     */
    public function setSeatsAvailable($seatsAvailable)
    {
        $this->seatsAvailable = $seatsAvailable;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRouteLayout()
    {
        return $this->routeLayout;
    }

    /**
     * @param mixed $routeLayout
     * @return Ride
     */
    public function setRouteLayout($routeLayout)
    {
        $this->routeLayout = $routeLayout;
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
     * @return Ride
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
     * @return Ride
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

}