<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2020
 * Time: 17:02
 */
class RiderTripCustomer extends BaseModel
{
    protected $id;
    protected $riderId;
    protected $tripCustomerId;
    protected $userId;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return RiderTripCustomer
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
     * @return RiderTripCustomer
     */
    public function setRiderId($riderId)
    {
        $this->riderId = $riderId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripCustomerId()
    {
        return $this->tripCustomerId;
    }

    /**
     * @param mixed $tripCustomerId
     * @return RiderTripCustomer
     */
    public function setTripCustomerId($tripCustomerId)
    {
        $this->tripCustomerId = $tripCustomerId;
        return $this;
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
     * @return RiderTripCustomer
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

}