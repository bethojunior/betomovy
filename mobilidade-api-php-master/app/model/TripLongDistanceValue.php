<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2020
 * Time: 19:32
 */
class TripLongDistanceValue extends BaseModel
{
    protected $id;
    protected $tripId;
    protected $driverId;
    protected $value;
    protected $kmDiff;
    protected $created_at;

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
     * @return TripLongDistanceValue
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
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
     * @return TripLongDistanceValue
     */
    public function setTripId($tripId)
    {
        $this->tripId = $tripId;
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
     * @return TripLongDistanceValue
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param mixed $value
     * @return TripLongDistanceValue
     */
    public function setValue($value)
    {
        $this->value = $value;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getKmDiff()
    {
        return $this->kmDiff;
    }

    /**
     * @param mixed $kmDiff
     * @return TripLongDistanceValue
     */
    public function setKmDiff($kmDiff)
    {
        $this->kmDiff = $kmDiff;
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
     * @return TripLongDistanceValue
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

}