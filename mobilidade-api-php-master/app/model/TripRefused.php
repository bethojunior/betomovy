<?php

namespace app\model;

use app\utils\BaseModel;

class TripRefused extends BaseModel
{
    protected $table = "tripRefused";
    protected $primaryKey = 'id';

    protected $id;
    protected $driverId;
    protected $tripId;
    protected $created_at;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return TripRefused
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
     * @param mixed $tripId
     * @return TripRefused
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
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
     * @return TripRefused
     */
    public function setTripId($tripId)
    {
        $this->tripId = $tripId;
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
     * @return TripRefused
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }
}