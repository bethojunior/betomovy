<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/05/2020
 * Time: 13:52
 */
class CreditPrepaidPurchase extends BaseModel
{
    protected $id;
    protected $value;
    protected $amount;
    protected $credited;
    protected $refused;
    protected $creditPrepaidId;
    protected $statusDetail;
    protected $userId;
    protected $cardId;
    protected $transactionId;
    protected $balanceFlowId;
    protected $expirationDate;
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
     * @return CreditPrepaidPurchase
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
     * @return CreditPrepaidPurchase
     */
    public function setValue($value)
    {
        $this->value = $value;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * @param mixed $amount
     * @return CreditPrepaidPurchase
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCredited()
    {
        return $this->credited;
    }

    /**
     * @param mixed $credited
     * @return CreditPrepaidPurchase
     */
    public function setCredited($credited)
    {
        $this->credited = $credited;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRefused()
    {
        return $this->refused;
    }

    /**
     * @param mixed $refused
     * @return CreditPrepaidPurchase
     */
    public function setRefused($refused)
    {
        $this->refused = $refused;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCreditPrepaidId()
    {
        return $this->creditPrepaidId;
    }

    /**
     * @param mixed $creditPrepaidId
     * @return CreditPrepaidPurchase
     */
    public function setCreditPrepaidId($creditPrepaidId)
    {
        $this->creditPrepaidId = $creditPrepaidId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatusDetail()
    {
        return $this->statusDetail;
    }

    /**
     * @param mixed $statusDetail
     * @return CreditPrepaidPurchase
     */
    public function setStatusDetail($statusDetail)
    {
        $this->statusDetail = $statusDetail;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     * @return CreditPrepaidPurchase
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
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
     * @return CreditPrepaidPurchase
     */
    public function setCardId($cardId)
    {
        $this->cardId = $cardId;
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
     * @return CreditPrepaidPurchase
     */
    public function setTransactionId($transactionId)
    {
        $this->transactionId = $transactionId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBalanceFlowId()
    {
        return $this->balanceFlowId;
    }

    /**
     * @param mixed $balanceFlowId
     * @return CreditPrepaidPurchase
     */
    public function setBalanceFlowId($balanceFlowId)
    {
        $this->balanceFlowId = $balanceFlowId;
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
     * @return CreditPrepaidPurchase
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
     * @return CreditPrepaidPurchase
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getExpirationDate()
    {
        return $this->expirationDate;
    }

    /**
     * @param mixed $expirationDate
     * @return CreditPrepaidPurchase
     */
    public function setExpirationDate($expirationDate)
    {
        $this->expirationDate = $expirationDate;
        return $this;
    }

}