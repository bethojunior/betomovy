<?php

namespace app\model;

use app\utils\BaseModel;

class ChatTrip extends BaseModel
{
    const ACTIVE = 1;

    protected $idChatTrip;
    protected $tripReference;
    protected $driverId;
    protected $userId;
    protected $date;
    protected $status;

    protected $table = 'chatTrip';

    public function __construct($obj = null)
    {
        $this->date = $obj->date ?? now();

        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdChatTrip()
    {
        return $this->idChatTrip;
    }

    /**
     * @param mixed $idChatTrip
     * @return ChatTrip
     */
    public function setIdChatTrip($idChatTrip)
    {
        $this->idChatTrip = $idChatTrip;
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
     * @return ChatTrip
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
     * @return ChatTrip
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
     * @return ChatTrip
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param false|string $date
     * @return ChatTrip
     */
    public function setDate($date)
    {
        $this->date = $date;
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
     * @return ChatTrip
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

}