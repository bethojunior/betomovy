<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/05/2019
 * Time: 14:15
 */
class PartnerCommission extends BaseModel
{
    protected $id;
    protected $statusId;
    protected $partnerId;
    protected $partnerCommissionType;
    protected $partnerCommissionValue;
    protected $managerCommissionType;
    protected $managerCommissionValue;
    protected $appCommissionType;
    protected $appCommissionValue;

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
     * @return PartnerCommission
     */
    public function setId($id)
    {
        $this->id = $id;
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
     * @return PartnerCommission
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPartnerId()
    {
        return $this->partnerId;
    }

    /**
     * @param mixed $partnerId
     * @return PartnerCommission
     */
    public function setPartnerId($partnerId)
    {
        $this->partnerId = $partnerId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPartnerCommissionType()
    {
        return $this->partnerCommissionType;
    }

    /**
     * @param mixed $partnerCommissionType
     * @return PartnerCommission
     */
    public function setPartnerCommissionType($partnerCommissionType)
    {
        $this->partnerCommissionType = $partnerCommissionType;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPartnerCommissionValue()
    {
        return $this->partnerCommissionValue;
    }

    /**
     * @param mixed $partnerCommissionValue
     * @return PartnerCommission
     */
    public function setPartnerCommissionValue($partnerCommissionValue)
    {
        $this->partnerCommissionValue = $partnerCommissionValue;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getManagerCommissionType()
    {
        return $this->managerCommissionType;
    }

    /**
     * @param mixed $managerCommissionType
     * @return PartnerCommission
     */
    public function setManagerCommissionType($managerCommissionType)
    {
        $this->managerCommissionType = $managerCommissionType;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getManagerCommissionValue()
    {
        return $this->managerCommissionValue;
    }

    /**
     * @param mixed $managerCommissionValue
     * @return PartnerCommission
     */
    public function setManagerCommissionValue($managerCommissionValue)
    {
        $this->managerCommissionValue = $managerCommissionValue;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAppCommissionType()
    {
        return $this->appCommissionType;
    }

    /**
     * @param mixed $appCommissionType
     * @return PartnerCommission
     */
    public function setAppCommissionType($appCommissionType)
    {
        $this->appCommissionType = $appCommissionType;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAppCommissionValue()
    {
        return $this->appCommissionValue;
    }

    /**
     * @param mixed $appCommissionValue
     * @return PartnerCommission
     */
    public function setAppCommissionValue($appCommissionValue)
    {
        $this->appCommissionValue = $appCommissionValue;
        return $this;
    }

}