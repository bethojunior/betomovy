<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/09/2018
 * Time: 16:57
 */
class Spot extends BaseModel
{
    protected $id;
    protected $spotTypeId;
    protected $clickPhotos;
    protected $clickPhone;
    protected $clickDiscount;
    protected $clickWhats;
    protected $phoneClient;
    protected $timeIn;
    protected $timeOut;
    protected $establishmentId;
    protected $driverId;
    protected $created_at;

    protected $primaryKey = 'id';

    public function __construct($obj = null)
    {
        $this->created_at = now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return Spot
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSpotTypeId()
    {
        return $this->spotTypeId;
    }

    /**
     * @param mixed $spotTypeId
     * @return Spot
     */
    public function setSpotTypeId($spotTypeId)
    {
        $this->spotTypeId = $spotTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getClickPhotos()
    {
        return $this->clickPhotos;
    }

    /**
     * @param mixed $clickPhotos
     * @return Spot
     */
    public function setClickPhotos($clickPhotos)
    {
        $this->clickPhotos = $clickPhotos;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getClickPhone()
    {
        return $this->clickPhone;
    }

    /**
     * @param mixed $clickPhone
     * @return Spot
     */
    public function setClickPhone($clickPhone)
    {
        $this->clickPhone = $clickPhone;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getClickDiscount()
    {
        return $this->clickDiscount;
    }

    /**
     * @param mixed $clickDiscount
     * @return Spot
     */
    public function setClickDiscount($clickDiscount)
    {
        $this->clickDiscount = $clickDiscount;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getClickWhats()
    {
        return $this->clickWhats;
    }

    /**
     * @param mixed $clickWhats
     * @return Spot
     */
    public function setClickWhats($clickWhats)
    {
        $this->clickWhats = $clickWhats;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPhoneClient()
    {
        return $this->phoneClient;
    }

    /**
     * @param mixed $phoneClient
     * @return Spot
     */
    public function setPhoneClient($phoneClient)
    {
        $this->phoneClient = $phoneClient;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTimeIn()
    {
        return $this->timeIn;
    }

    /**
     * @param mixed $timeIn
     * @return Spot
     */
    public function setTimeIn($timeIn)
    {
        $this->timeIn = $timeIn;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTimeOut()
    {
        return $this->timeOut;
    }

    /**
     * @param mixed $timeOut
     * @return Spot
     */
    public function setTimeOut($timeOut)
    {
        $this->timeOut = $timeOut;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEstablishmentId()
    {
        return $this->establishmentId;
    }

    /**
     * @param mixed $establishmentId
     * @return Spot
     */
    public function setEstablishmentId($establishmentId)
    {
        $this->establishmentId = $establishmentId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverId()
    {
        return $this->driverId;
    }

    /**
     * @param mixed $driverId
     * @return Spot
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
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
     * @return Spot
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

}