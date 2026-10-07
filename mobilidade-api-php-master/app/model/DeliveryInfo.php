<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 17:33
 */
class DeliveryInfo extends BaseModel
{
    protected $id;
    protected $tripReference;
    protected $obsOrigin;
    protected $obsDestination;
    protected $obs;

    protected $primaryKey = 'id';

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return DeliveryInfo
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripReference()
    {
        return $this->tripReference;
    }

    /**
     * @param mixed $tripReference
     * @return DeliveryInfo
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getObsOrigin()
    {
        return $this->obsOrigin;
    }

    /**
     * @param mixed $obsOrigin
     * @return DeliveryInfo
     */
    public function setObsOrigin($obsOrigin)
    {
        $this->obsOrigin = $obsOrigin;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getObsDestination()
    {
        return $this->obsDestination;
    }

    /**
     * @param mixed $obsDestination
     * @return DeliveryInfo
     */
    public function setObsDestination($obsDestination)
    {
        $this->obsDestination = $obsDestination;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getObs()
    {
        return $this->obs;
    }

    /**
     * @param mixed $obs
     * @return DeliveryInfo
     */
    public function setObs($obs)
    {
        $this->obs = $obs;
        return $this;
    }

}