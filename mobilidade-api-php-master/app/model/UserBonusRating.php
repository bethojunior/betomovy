<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/01/2019
 * Time: 16:55
 */
class UserBonusRating extends BaseModel
{
    protected $idUserBonusRating;
    protected $userBonusRatingTypeId;
    protected $userId;
    protected $created_at;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdUserBonusRating()
    {
        return $this->idUserBonusRating;
    }

    /**
     * @param mixed $idUserBonusRating
     * @return UserBonusRating
     */
    public function setIdUserBonusRating($idUserBonusRating)
    {
        $this->idUserBonusRating = $idUserBonusRating;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserBonusRatingTypeId()
    {
        return $this->userBonusRatingTypeId;
    }

    /**
     * @param mixed $userBonusRatingTypeId
     * @return UserBonusRating
     */
    public function setUserBonusRatingTypeId($userBonusRatingTypeId)
    {
        $this->userBonusRatingTypeId = $userBonusRatingTypeId;
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
     * @return UserBonusRating
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
     * @return UserBonusRating
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

}