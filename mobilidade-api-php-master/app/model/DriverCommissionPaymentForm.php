<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/03/2019
 * Time: 16:07
 */
class DriverCommissionPaymentForm extends BaseModel
{
    protected $id;
    protected $value;
    protected $valueType;
    protected $tripPaymentFormId;
    protected $driverCommissionId;

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
     * @return DriverCommissionPaymentForm
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
     * @return DriverCommissionPaymentForm
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
     * @return DriverCommissionPaymentForm
     */
    public function setValueType($valueType)
    {
        $this->valueType = $valueType;
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
     * @return DriverCommissionPaymentForm
     */
    public function setTripPaymentFormId($tripPaymentFormId)
    {
        $this->tripPaymentFormId = $tripPaymentFormId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverCommissionId()
    {
        return $this->driverCommissionId;
    }

    /**
     * @param mixed $driverCommissionId
     * @return DriverCommissionPaymentForm
     */
    public function setDriverCommissionId($driverCommissionId)
    {
        $this->driverCommissionId = $driverCommissionId;
        return $this;
    }

}