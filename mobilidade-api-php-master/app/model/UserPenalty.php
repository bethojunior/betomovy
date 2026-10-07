<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/01/2019
 * Time: 17:49
 */
class UserPenalty extends BaseModel
{
    protected $idUserPenalty;
    protected $userPenaltyTypeId;
    protected $userId;
    protected $created_at;
    protected $statusId;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdUserPenalty()
    {
        return $this->idUserPenalty;
    }

    /**
     * @param mixed $idUserPenalty
     * @return UserPenalty
     */
    public function setIdUserPenalty($idUserPenalty)
    {
        $this->idUserPenalty = $idUserPenalty;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserPenaltyTypeId()
    {
        return $this->userPenaltyTypeId;
    }

    /**
     * @param mixed $userPenaltyTypeId
     * @return UserPenalty
     */
    public function setUserPenaltyTypeId($userPenaltyTypeId)
    {
        $this->userPenaltyTypeId = $userPenaltyTypeId;
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
     * @return UserPenalty
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
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
     * @return UserPenalty
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
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
     * @return UserPenalty
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}