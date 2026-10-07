<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 16/07/2018
 * Time: 16:11
 */
class Location extends BaseModel
{
    protected $_id;
    protected $latitude;
    protected $longitude;
    protected $deviceId;
    protected $deviceModel;
    protected $created_at;
    protected $registered_at;
    protected $driverId;
    protected $tripId;
    protected $userId;
    protected $tripReference;
    protected $longDistanceDelivery;
    protected $address;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        $this->registered_at = now();
        // $this->registered_at = date('Y-m-d H:i:s');
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->_id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->_id = $id;
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
    public function setLatitude($latitude)
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
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;
    }

    /**
     * @return mixed
     */
    public function getDeviceId()
    {
        return $this->deviceId;
    }

    /**
     * @param mixed $deviceId
     */
    public function setDeviceId($deviceId)
    {
        $this->deviceId = $deviceId;
    }

    /**
     * @return mixed
     */
    public function getDeviceModel()
    {
        return $this->deviceModel;
    }

    /**
     * @param mixed $deviceModel
     */
    public function setDeviceModel($deviceModel)
    {
        $this->deviceModel = $deviceModel;
    }

    /**
     * @return mixed
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param mixed $created_at
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
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
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
    }

    /**
     * @return mixed
     */
    public function getTripId()
    {
        return $this->tripId;
    }

    /**
     * @param mixed $tripId
     */
    public function setTripId($tripId)
    {
        $this->tripId = $tripId;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     */
    public function setUserId($userId): void
    {
        $this->userId = $userId;
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
     * @return Location
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    public function getRegisteredAt()
    {
        return $this->registered_at;
    }

    public function setRegisteredAt($registered_at): Location
    {
        $this->registered_at = $registered_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLongDistanceDelivery()
    {
        return $this->longDistanceDelivery;
    }

    /**
     * @param mixed $longDistanceDelivery
     * @return Location
     */
    public function setLongDistanceDelivery($longDistanceDelivery)
    {
        $this->longDistanceDelivery = $longDistanceDelivery;
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
     * @return Location
     */
    public function setAddress($address)
    {
        $this->address = $address;
        return $this;
    }
}
