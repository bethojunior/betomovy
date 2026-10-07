<?php

namespace app\model;

use app\utils\BaseModel;

class WaitingHoursDrivers extends BaseModel
{
    protected $id;
    protected $userId;
    protected $tripReference;
    protected $timeInSeconds;
    protected $created_at;
    protected $updated_at;
    protected $deleted_at;

    protected $table = 'waitingHoursDrivers';

    public function __construct($obj = null)
    {
        $this->created_at = now();
        parent::__construct($obj);
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    public function getUserId()
    {
        return $this->userId;
    }

    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }


    public function getTripReference()
    {
        return $this->tripReference;
    }

    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    public function getTimeInSeconds()
    {
        return $this->timeInSeconds;
    }

    public function setTimeInSeconds($timeInSeconds)
    {
        $this->timeInSeconds = $timeInSeconds;
        return $this;
    }

    public function getCreatedAt()
    {
        return $this->created_at;
    }

    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    public function getDeletedAt()
    {
        return $this->deleted_at;
    }

    public function setDeletedAt($deleted_at)
    {
        $this->deleted_at = $deleted_at;
        return $this;
    }
}
