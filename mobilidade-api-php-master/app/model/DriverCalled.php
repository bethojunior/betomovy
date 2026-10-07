<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/01/2019
 * Time: 14:48
 */
class DriverCalled extends BaseModel
{
    protected $id;
    protected $driverId;
    protected $tripReference;
    protected $proximity;
    protected $destinationProximity;
    protected $created_at;
    protected $updated_at;
    protected $status;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? gmdate('Y-m-d H:i:s', strtotime(now()));
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
     * @return DriverCalled
     */
    public function setId($id)
    {
        $this->id = $id;
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
     * @return DriverCalled
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
     * @return DriverCalled
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getProximity()
    {
        return $this->proximity;
    }

    /**
     * @param mixed $proximity
     * @return DriverCalled
     */
    public function setProximity($proximity)
    {
        $this->proximity = $proximity;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDestinationProximity()
    {
        return $this->destinationProximity;
    }

    /**
     * @param mixed $destinationProximity
     * @return DriverCalled
     */
    public function setDestinationProximity($destinationProximity)
    {
        $this->destinationProximity = $destinationProximity;
        return $this;
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
     * @return DriverCalled
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param mixed $updated_at
     * @return DriverCalled
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     * @return DriverCalled
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

}