<?php

namespace app\realtime;

use app\utils\CloudFirestore;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/04/2019
 * Time: 11:39
 */
class ChatTripRealtime extends CloudFirestore
{
    protected $collection = 'chatTrip';

    protected $tripReference;
    protected $driverId;
    protected $userId;
    protected $date;

    /**
     * @return mixed
     */
    public function getTripReference()
    {
        return $this->tripReference;
    }

    /**
     * @param mixed $tripReference
     * @return ChatTripRealtime
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
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
     * @return ChatTripRealtime
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
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
     * @return ChatTripRealtime
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     * @return ChatTripRealtime
     */
    public function setDate($date)
    {
        $this->date = $date;
        return $this;
    }

}