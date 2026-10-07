<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/01/2019
 * Time: 16:50
 */
class UserBonusRatingType extends BaseModel
{
    protected $idUserBonusRatingType;
    protected $name;
    protected $statusId;
    protected $valueRating;

    /**
     * @return mixed
     */
    public function getIdUserBonusRatingType()
    {
        return $this->idUserBonusRatingType;
    }

    /**
     * @param mixed $idUserBonusRatingType
     * @return UserBonusRatingType
     */
    public function setIdUserBonusRatingType($idUserBonusRatingType)
    {
        $this->idUserBonusRatingType = $idUserBonusRatingType;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     * @return UserBonusRatingType
     */
    public function setName($name)
    {
        $this->name = $name;
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
     * @return UserBonusRatingType
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getValueRating()
    {
        return $this->valueRating;
    }

    /**
     * @param mixed $valueRating
     * @return UserBonusRatingType
     */
    public function setValueRating($valueRating)
    {
        $this->valueRating = $valueRating;
        return $this;
    }

}