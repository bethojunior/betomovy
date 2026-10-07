<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/02/2019
 * Time: 18:02
 */
class CityCallConfig extends BaseModel
{
    protected $primaryKey = 'id';

    protected $id;
    protected $userTypeId;
    protected $cityId;
    protected $seq;
    protected $statusId;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return CityCallConfig
     */
    public function setId($id)
    {
        $this->id = $id;
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
     * @return CityCallConfig
     */
    public function setUserTypeId($userTypeId)
    {
        $this->userTypeId = $userTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCityId()
    {
        return $this->cityId;
    }

    /**
     * @param mixed $cityId
     * @return CityCallConfig
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSeq()
    {
        return $this->seq;
    }

    /**
     * @param mixed $seq
     * @return CityCallConfig
     */
    public function setSeq($seq)
    {
        $this->seq = $seq;
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
     * @return CityCallConfig
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}