<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2020
 * Time: 10:33
 */
class RideItem extends BaseModel
{
    protected $id;
    protected $routeTripItemTypeId;
    protected $rideId;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return RideItem
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRouteTripItemTypeId()
    {
        return $this->routeTripItemTypeId;
    }

    /**
     * @param mixed $routeTripItemTypeId
     * @return RideItem
     */
    public function setRouteTripItemTypeId($routeTripItemTypeId)
    {
        $this->routeTripItemTypeId = $routeTripItemTypeId;
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
     * @return RideItem
     */
    public function setRideId($rideId)
    {
        $this->rideId = $rideId;
        return $this;
    }

}