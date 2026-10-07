<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 11:40
 */
class LevelAccess extends BaseModel
{
    protected $idLevelAccess;
    protected $userId;
    protected $userTypeId;

    protected $table = "levelAccess";

    /**
     * @return mixed
     */
    public function getIdLevelAccess()
    {
        return $this->idLevelAccess;
    }

    /**
     * @param mixed $idLevelAccess
     * @return LevelAccess
     */
    public function setIdLevelAccess($idLevelAccess)
    {
        $this->idLevelAccess = $idLevelAccess;
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
     * @return LevelAccess
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserTypeId()
    {
        return $this->userTypeId;
    }

    /**
     * @param mixed $userTypeId
     * @return LevelAccess
     */
    public function setUserTypeId($userTypeId)
    {
        $this->userTypeId = $userTypeId;
        return $this;
    }

}