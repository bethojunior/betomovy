<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 13/07/2018
 * Time: 10:10
 */
class Cooperative extends BaseModel
{
    protected $idCooperative;
    protected $name;
    protected $cityId;
    protected $updated_at;
    protected $created_at;
    protected $logo_image;
    protected $statusId;

    /**
     * @return mixed
     */
    public function getIdCooperative()
    {
        return $this->idCooperative;
    }

    /**
     * @param mixed $idCooperative
     * @return Cooperative
     */
    public function setIdCooperative($idCooperative)
    {
        $this->idCooperative = $idCooperative;
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
     * @return Cooperative
     */
    public function setName($name)
    {
        $this->name = $name;
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
     * @return Cooperative
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param mixed $updated_at
     * @return Cooperative
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
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
     * @return Cooperative
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLogoImage()
    {
        return $this->logo_image;
    }

    /**
     * @param mixed $logo_image
     * @return Cooperative
     */
    public function setLogoImage($logo_image)
    {
        $this->logo_image = $logo_image;
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
     * @return Cooperative
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}