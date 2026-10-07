<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/01/2019
 * Time: 17:48
 */
class UserPenaltiesType extends BaseModel
{
    protected $idUserPenaltyType;
    protected $name;
    protected $valueRating;
    protected $statusId;

    /**
     * @return mixed
     */
    public function getIdUserPenaltyType()
    {
        return $this->idUserPenaltyType;
    }

    /**
     * @param mixed $idUserPenaltyType
     * @return UserPenaltiesType
     */
    public function setIdUserPenaltyType($idUserPenaltyType)
    {
        $this->idUserPenaltyType = $idUserPenaltyType;
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
     * @return UserPenaltiesType
     */
    public function setName($name)
    {
        $this->name = $name;
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
     * @return UserPenaltiesType
     */
    public function setValueRating($valueRating)
    {
        $this->valueRating = $valueRating;
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
     * @return UserPenaltiesType
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}