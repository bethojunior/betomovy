<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/01/2019
 * Time: 11:20
 */
class PlaceType extends BaseModel
{
    protected $idPlaceType;
    protected $name;
    protected $statusId;

    /**
     * @return mixed
     */
    public function getIdPlaceType()
    {
        return $this->idPlaceType;
    }

    /**
     * @param mixed $idPlaceType
     * @return PlaceType
     */
    public function setIdPlaceType($idPlaceType)
    {
        $this->idPlaceType = $idPlaceType;
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
     * @return PlaceType
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
     * @return PlaceType
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}