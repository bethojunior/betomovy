<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/12/2018
 * Time: 15:34
 */
class MpCardInfo extends BaseModel
{
    protected $idCardInfo;
    protected $mpCustomerId;
    protected $mpCardId;
    protected $mpFirstSixDigits;
    protected $mpSecurityCodeLength;
    protected $mpPaymentMethodName;
    protected $mpLastFourDigits;

    /**
     * @return mixed
     */
    public function getIdCardInfo()
    {
        return $this->idCardInfo;
    }

    /**
     * @param mixed $idCardInfo
     * @return MpCardInfo
     */
    public function setIdCardInfo($idCardInfo)
    {
        $this->idCardInfo = $idCardInfo;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMpCustomerId()
    {
        return $this->mpCustomerId;
    }

    /**
     * @param mixed $mpCustomerId
     * @return MpCardInfo
     */
    public function setMpCustomerId($mpCustomerId)
    {
        $this->mpCustomerId = $mpCustomerId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMpCardId()
    {
        return $this->mpCardId;
    }

    /**
     * @param mixed $mpCardId
     * @return MpCardInfo
     */
    public function setMpCardId($mpCardId)
    {
        $this->mpCardId = $mpCardId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMpFirstSixDigits()
    {
        return $this->mpFirstSixDigits;
    }

    /**
     * @param mixed $mpFirstSixDigits
     * @return MpCardInfo
     */
    public function setMpFirstSixDigits($mpFirstSixDigits)
    {
        $this->mpFirstSixDigits = $mpFirstSixDigits;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMpSecurityCodeLength()
    {
        return $this->mpSecurityCodeLength;
    }

    /**
     * @param mixed $mpSecurityCodeLength
     * @return MpCardInfo
     */
    public function setMpSecurityCodeLength($mpSecurityCodeLength)
    {
        $this->mpSecurityCodeLength = $mpSecurityCodeLength;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMpPaymentMethodName()
    {
        return $this->mpPaymentMethodName;
    }

    /**
     * @param mixed $mpPaymentMethodName
     * @return MpCardInfo
     */
    public function setMpPaymentMethodName($mpPaymentMethodName)
    {
        $this->mpPaymentMethodName = $mpPaymentMethodName;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMpLastFourDigits()
    {
        return $this->mpLastFourDigits;
    }

    /**
     * @param mixed $mpLastFourDigits
     * @return MpCardInfo
     */
    public function setMpLastFourDigits($mpLastFourDigits)
    {
        $this->mpLastFourDigits = $mpLastFourDigits;
        return $this;
    }

}