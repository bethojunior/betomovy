<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/12/2019
 * Time: 10:16
 */
class Cashback extends BaseModel
{
    protected $id;
    protected $value;
    protected $valueType;
    protected $addToFinalPrice;
    protected $backToTripBalance;
    protected $cityId;
    protected $tripTypeId;
    protected $active;
    protected $statusId;
    protected $created_at;
    protected $updated_at;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();

        parent::__construct($obj);
        $this->updated_at = now();
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
     * @return Cashback
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param mixed $value
     * @return Cashback
     */
    public function setValue($value)
    {
        $this->value = $value;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getValueType()
    {
        return $this->valueType;
    }

    /**
     * @param mixed $valueType
     * @return Cashback
     */
    public function setValueType($valueType)
    {
        $this->valueType = $valueType;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAddToFinalPrice()
    {
        return $this->addToFinalPrice;
    }

    /**
     * @param mixed $addToFinalPrice
     * @return Cashback
     */
    public function setAddToFinalPrice($addToFinalPrice)
    {
        $this->addToFinalPrice = $addToFinalPrice;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBackToTripBalance()
    {
        return $this->backToTripBalance;
    }

    /**
     * @param mixed $backToTripBalance
     * @return Cashback
     */
    public function setBackToTripBalance($backToTripBalance)
    {
        $this->backToTripBalance = $backToTripBalance;
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
     * @return Cashback
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripTypeId()
    {
        return $this->tripTypeId;
    }

    /**
     * @param mixed $tripTypeId
     * @return Cashback
     */
    public function setTripTypeId($tripTypeId)
    {
        $this->tripTypeId = $tripTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * @param mixed $active
     * @return Cashback
     */
    public function setActive($active)
    {
        $this->active = $active;
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
     * @return Cashback
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param false|string $created_at
     * @return Cashback
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param false|string $updated_at
     * @return Cashback
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

}