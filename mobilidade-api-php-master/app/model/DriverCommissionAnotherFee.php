<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/03/2019
 * Time: 16:09
 */
class DriverCommissionAnotherFee extends BaseModel
{
    protected $id;
    protected $valueType;
    protected $tax_value;
    protected $another_value;
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
     * @return DriverCommissionAnotherFee
     */
    public function setId($id)
    {
        $this->id = $id;
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
     * @return DriverCommissionAnotherFee
     */
    public function setValueType($valueType)
    {
        $this->valueType = $valueType;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTaxValue()
    {
        return $this->tax_value;
    }

    /**
     * @param mixed $tax_value
     * @return DriverCommissionAnotherFee
     */
    public function setTaxValue($tax_value)
    {
        $this->tax_value = $tax_value;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAnotherValue()
    {
        return $this->another_value;
    }

    /**
     * @param mixed $another_value
     * @return DriverCommissionAnotherFee
     */
    public function setAnotherValue($another_value)
    {
        $this->another_value = $another_value;
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
     * @return DriverCommissionAnotherFee
     */
    public function setDriverCommissionId($driverCommissionId)
    {
        $this->driverCommissionId = $driverCommissionId;
        return $this;
    }

    public function extractOnlyValues()
    {
        $values = $this->toArray();

        unset($values['driverCommissionId']);
        unset($values['id']);

        return $values;
    }
}