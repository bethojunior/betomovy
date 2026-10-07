<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/01/2020
 * Time: 09:30
 */
class RiderItem extends BaseModel
{
    protected $id;
    protected $riderId;
    protected $rideItemId;
    protected $quantity;

    protected $primaryKey = 'id';

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return RiderItem
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRiderId()
    {
        return $this->riderId;
    }

    /**
     * @param mixed $riderId
     * @return RiderItem
     */
    public function setRiderId($riderId)
    {
        $this->riderId = $riderId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRideItemId()
    {
        return $this->rideItemId;
    }

    /**
     * @param mixed $rideItemId
     * @return RiderItem
     */
    public function setRideItemId($rideItemId)
    {
        $this->rideItemId = $rideItemId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getQuantity()
    {
        return $this->quantity;
    }

    /**
     * @param mixed $quantity
     * @return RiderItem
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;
        return $this;
    }

}