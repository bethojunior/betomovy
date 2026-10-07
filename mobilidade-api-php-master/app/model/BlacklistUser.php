<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/01/2019
 * Time: 14:54
 */
class BlacklistUser extends BaseModel
{
    protected $idBlacklistUser;
    protected $userId;
    protected $description;
    protected $created_at;
    protected $expiration_time;
    protected $timeSuspended;
    protected $statusId;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdBlacklistUser()
    {
        return $this->idBlacklistUser;
    }

    /**
     * @param mixed $idBlacklistUser
     * @return BlacklistUser
     */
    public function setIdBlacklistUser($idBlacklistUser)
    {
        $this->idBlacklistUser = $idBlacklistUser;
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
     * @return BlacklistUser
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     * @return BlacklistUser
     */
    public function setDescription($description)
    {
        $this->description = $description;
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
     * @return BlacklistUser
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getExpirationTime()
    {
        return $this->expiration_time;
    }

    /**
     * @param mixed $expiration_time
     * @return BlacklistUser
     */
    public function setExpirationTime($expiration_time)
    {
        $this->expiration_time = $expiration_time;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTimeSuspended()
    {
        return $this->timeSuspended;
    }

    /**
     * @param mixed $timeSuspended
     * @return BlacklistUser
     */
    public function setTimeSuspended($timeSuspended)
    {
        $this->timeSuspended = $timeSuspended;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatusId()
    {
        return $this->statusId;
    }

    /**
     * @param mixed $statusId
     * @return BlacklistUser
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}