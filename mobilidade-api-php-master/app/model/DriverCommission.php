<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/02/2019
 * Time: 16:29
 */
class DriverCommission extends BaseModel
{
    protected $idDriverCommission;
    protected $value;
    protected $valueType;
    protected $cityId;
    protected $tripTypeId;
    protected $statusId;
    protected $created_at;
    protected $updated_at;
    protected $disableOnPromotion;
    /** @var null|DriverCommissionAnotherFee $anotherFee */
    protected $anotherFee;
    /** @var null|array */
    protected $paymentFormCommissions;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdDriverCommission()
    {
        return $this->idDriverCommission;
    }

    /**
     * @param mixed $idDriverCommission
     * @return DriverCommission
     */
    public function setIdDriverCommission($idDriverCommission)
    {
        $this->idDriverCommission = $idDriverCommission;
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
     * @return DriverCommission
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
     * @return DriverCommission
     */
    public function setValueType($valueType)
    {
        $this->valueType = $valueType;
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
     * @return DriverCommission
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
     * @return DriverCommission
     */
    public function setTripTypeId($tripTypeId)
    {
        $this->tripTypeId = $tripTypeId;
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
     * @return DriverCommission
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
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
     * @return DriverCommission
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
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
     * @return DriverCommission
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return DriverCommissionAnotherFee|null
     */
    public function getAnotherFee(): ?DriverCommissionAnotherFee
    {
        return $this->anotherFee;
    }

    /**
     * @param DriverCommissionAnotherFee|null $anotherFee
     * @return DriverCommission
     */
    public function setAnotherFee(?DriverCommissionAnotherFee $anotherFee): DriverCommission
    {
        $this->anotherFee = $anotherFee;
        return $this;
    }

    /**
     * @return array|null
     */
    public function getPaymentFormCommissions(): ?array
    {
        return $this->paymentFormCommissions;
    }

    /**
     * @param array|null $paymentFormCommissions
     * @return DriverCommission
     */
    public function setPaymentFormCommissions(?array $paymentFormCommissions): DriverCommission
    {
        $this->paymentFormCommissions = $paymentFormCommissions;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDisableOnPromotion()
    {
        return $this->disableOnPromotion;
    }

    /**
     * @param mixed $disableOnPromotion
     * @return DriverCommission
     */
    public function setDisableOnPromotion($disableOnPromotion)
    {
        $this->disableOnPromotion = $disableOnPromotion;
        return $this;
    }

}