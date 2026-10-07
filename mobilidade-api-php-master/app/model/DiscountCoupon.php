<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 13:52
 */
class DiscountCoupon extends BaseModel
{
    protected $id;
    protected $code;
    protected $tripPaymentFormId;
    protected $genderId;
    protected $cityId;
    protected $value;
    protected $valueType;
    protected $limitedTo;
    protected $fromValue;
    protected $bonusDriver;
    protected $uniqueUse;
    protected $active;
    protected $dateStart;
    protected $dateEnd;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return DiscountCoupon
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * @param mixed $code
     * @return DiscountCoupon
     */
    public function setCode($code)
    {
        $this->code = $code;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripPaymentFormId()
    {
        return $this->tripPaymentFormId;
    }

    /**
     * @param mixed $tripPaymentFormId
     * @return DiscountCoupon
     */
    public function setTripPaymentFormId($tripPaymentFormId)
    {
        $this->tripPaymentFormId = $tripPaymentFormId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getGenderId()
    {
        return $this->genderId;
    }

    /**
     * @param mixed $genderId
     * @return DiscountCoupon
     */
    public function setGenderId($genderId)
    {
        $this->genderId = $genderId;
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
     * @return DiscountCoupon
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
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
     * @return DiscountCoupon
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
     * @return DiscountCoupon
     */
    public function setValueType($valueType)
    {
        $this->valueType = $valueType;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLimitedTo()
    {
        return $this->limitedTo;
    }

    /**
     * @param mixed $limitedTo
     * @return DiscountCoupon
     */
    public function setLimitedTo($limitedTo)
    {
        $this->limitedTo = $limitedTo;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFromValue()
    {
        return $this->fromValue;
    }

    /**
     * @param mixed $fromValue
     * @return DiscountCoupon
     */
    public function setFromValue($fromValue)
    {
        $this->fromValue = $fromValue;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBonusDriver()
    {
        return $this->bonusDriver;
    }

    /**
     * @param mixed $bonusDriver
     * @return DiscountCoupon
     */
    public function setBonusDriver($bonusDriver)
    {
        $this->bonusDriver = $bonusDriver;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUniqueUse()
    {
        return $this->uniqueUse;
    }

    /**
     * @param mixed $uniqueUse
     * @return DiscountCoupon
     */
    public function setUniqueUse($uniqueUse)
    {
        $this->uniqueUse = $uniqueUse;
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
     * @return DiscountCoupon
     */
    public function setActive($active)
    {
        $this->active = $active;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDateStart()
    {
        return $this->dateStart;
    }

    /**
     * @param mixed $dateStart
     * @return DiscountCoupon
     */
    public function setDateStart($dateStart)
    {
        $this->dateStart = $dateStart;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDateEnd()
    {
        return $this->dateEnd;
    }

    /**
     * @param mixed $dateEnd
     * @return DiscountCoupon
     */
    public function setDateEnd($dateEnd)
    {
        $this->dateEnd = $dateEnd;
        return $this;
    }

    public function toStdClass()
    {
        $this->valueType =
            $this->valueType == '$' ? 'R$' : $this->valueType;

        return parent::toStdClass();
    }
}