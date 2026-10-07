<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 25/07/2018
 * Time: 13:24
 */
class Zone extends BaseModel
{
    protected $idZone;
    protected $name;
    protected $radius;
    protected $longDistanceRadius;

    /**
     * @return mixed
     */
    public function getIdZone()
    {
        return $this->idZone;
    }

    /**
     * @param mixed $idZone
     */
    public function setIdZone($idZone): void
    {
        $this->idZone = $idZone;
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
     */
    public function setName($name): void
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getRadius()
    {
        return $this->radius;
    }

    /**
     * @param mixed $radius
     */
    public function setRadius($radius): void
    {
        $this->radius = $radius;
    }

    /**
     * @return mixed
     */
    public function getLongDistanceRadius()
    {
        return $this->longDistanceRadius;
    }

    /**
     * @param mixed $longDistanceRadius
     * @return Zone
     */
    public function setLongDistanceRadius($longDistanceRadius)
    {
        $this->longDistanceRadius = $longDistanceRadius;
        return $this;
    }

}