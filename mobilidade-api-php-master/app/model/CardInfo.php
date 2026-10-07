<?php

namespace app\model;

use app\utils\BaseModel;

class CardInfo extends BaseModel
{
    protected $idCardInfo;
    protected $customerId;
    protected $cardId;
    protected $firstSixDigits;
    protected $securityCodeLength;
    protected $paymentMethodName;
    protected $lastFourDigits;
    protected $financialIntermediaryId;

    /**
     * @return mixed
     */
    public function getIdCardInfo()
    {
        return $this->idCardInfo;
    }

    /**
     * @param mixed $idCardInfo
     * @return CardInfo
     */
    public function setIdCardInfo($idCardInfo)
    {
        $this->idCardInfo = $idCardInfo;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCustomerId()
    {
        return $this->customerId;
    }

    /**
     * @param mixed $customerId
     * @return CardInfo
     */
    public function setCustomerId($customerId)
    {
        $this->customerId = $customerId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCardId()
    {
        return $this->cardId;
    }

    /**
     * @param mixed $cardId
     * @return CardInfo
     */
    public function setCardId($cardId)
    {
        $this->cardId = $cardId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFirstSixDigits()
    {
        return $this->firstSixDigits;
    }

    /**
     * @param mixed $firstSixDigits
     * @return CardInfo
     */
    public function setFirstSixDigits($firstSixDigits)
    {
        $this->firstSixDigits = $firstSixDigits;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSecurityCodeLength()
    {
        return $this->securityCodeLength;
    }

    /**
     * @param mixed $securityCodeLength
     * @return CardInfo
     */
    public function setSecurityCodeLength($securityCodeLength)
    {
        $this->securityCodeLength = $securityCodeLength;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPaymentMethodName()
    {
        return $this->paymentMethodName;
    }

    /**
     * @param mixed $paymentMethodName
     * @return CardInfo
     */
    public function setPaymentMethodName($paymentMethodName)
    {
        $this->paymentMethodName = $paymentMethodName;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLastFourDigits()
    {
        return $this->lastFourDigits;
    }

    /**
     * @param mixed $lastFourDigits
     * @return CardInfo
     */
    public function setLastFourDigits($lastFourDigits)
    {
        $this->lastFourDigits = $lastFourDigits;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFinancialIntermediaryId()
    {
        return $this->financialIntermediaryId;
    }

    /**
     * @param mixed $financialIntermediaryId
     * @return CardInfo
     */
    public function setFinancialIntermediaryId($financialIntermediaryId)
    {
        $this->financialIntermediaryId = $financialIntermediaryId;
        return $this;
    }

}