<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 10/08/2018
 * Time: 18:11
 */
class BalanceFlow extends BaseModel
{
    protected $table = "balanceFlow";

    protected $idBalanceFlow;
    protected $balanceFlowTypeId;
    protected $value;
    protected $date;
    protected $balanceId;
    protected $tripReference;
    protected $withdrawId;
    protected $transactionId;
    protected $rewardTripId;
    protected $rewardCampaignTripId;
    protected $customerCancellationFeeId;
    protected $taxId;

    /**
     * @return mixed
     */
    public function getIdBalanceFlow()
    {
        return $this->idBalanceFlow;
    }

    /**
     * @param mixed $idBalanceFlow
     */
    public function setIdBalanceFlow($idBalanceFlow)
    {
        $this->idBalanceFlow = $idBalanceFlow;
    }

    /**
     * @return mixed
     */
    public function getBalanceFlowTypeId()
    {
        return $this->balanceFlowTypeId;
    }

    /**
     * @param mixed $balanceFlowTypeId
     */
    public function setBalanceFlowTypeId($balanceFlowTypeId)
    {
        $this->balanceFlowTypeId = $balanceFlowTypeId;
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
     */
    public function setValue($value)
    {
        $this->value = $value;
    }

    /**
     * @return mixed
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     */
    public function setDate($date)
    {
        $this->date = $date;
    }

    /**
     * @return mixed
     */
    public function getBalanceId()
    {
        return $this->balanceId;
    }

    /**
     * @param mixed $balanceId
     */
    public function setBalanceId($balanceId)
    {
        $this->balanceId = $balanceId;
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
     * @return BalanceFlow
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getWithdrawId()
    {
        return $this->withdrawId;
    }

    /**
     * @param mixed $withdrawId
     * @return BalanceFlow
     */
    public function setWithdrawId($withdrawId)
    {
        $this->withdrawId = $withdrawId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTransactionId()
    {
        return $this->transactionId;
    }

    /**
     * @param mixed $transactionId
     * @return BalanceFlow
     */
    public function setTransactionId($transactionId)
    {
        $this->transactionId = $transactionId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRewardTripId()
    {
        return $this->rewardTripId;
    }

    /**
     * @param mixed $rewardTripId
     * @return BalanceFlow
     */
    public function setRewardTripId($rewardTripId)
    {
        $this->rewardTripId = $rewardTripId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRewardCampaignTripId()
    {
        return $this->rewardCampaignTripId;
    }

    /**
     * @param mixed $rewardCampaignTripId
     * @return BalanceFlow
     */
    public function setRewardCampaignTripId($rewardCampaignTripId)
    {
        $this->rewardCampaignTripId = $rewardCampaignTripId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCustomerCancellationFeeId()
    {
        return $this->customerCancellationFeeId;
    }

    /**
     * @param mixed $customerCancellationFeeId
     * @return BalanceFlow
     */
    public function setCustomerCancellationFeeId($customerCancellationFeeId)
    {
        $this->customerCancellationFeeId = $customerCancellationFeeId;
        return $this;
    }

    public function getTaxId(): ?int
    {
        return $this->taxId;
    }

    public function setTaxId(?int $taxId): BalanceFlow
    {
        $this->taxId = $taxId;
        return $this;
    }
}