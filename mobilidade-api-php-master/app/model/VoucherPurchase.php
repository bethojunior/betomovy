<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2018
 * Time: 17:11
 */
class VoucherPurchase extends BaseModel
{
    protected $idVoucherPurchase;
    protected $status;
    protected $status_detail;
    /**
     * @var $amount
     * Valor do montante para entrar no saldo
     */
    protected $amount;
    /**
     * @var $value
     * Valor do que irá ser pago pelo montante
     */
    protected $value;
    protected $captured;
    protected $captured_amount;
    protected $userId;
    protected $cardId;
    protected $transactionId;
    protected $created_at;
    protected $updated_at;

    protected $table = 'voucherPurchase';

    public function __construct($obj = null)
    {
        $this->created_at = now();

        parent::__construct($obj);

        $this->updated_at = now();
    }

    /**
     * @return mixed
     */
    public function getIdVoucherPurchase()
    {
        return $this->idVoucherPurchase;
    }

    /**
     * @param mixed $idVoucherPurchase
     * @return VoucherPurchase
     */
    public function setIdVoucherPurchase($idVoucherPurchase)
    {
        $this->idVoucherPurchase = $idVoucherPurchase;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     * @return VoucherPurchase
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatusDetail()
    {
        return $this->status_detail;
    }

    /**
     * @param mixed $status_detail
     * @return VoucherPurchase
     */
    public function setStatusDetail($status_detail)
    {
        $this->status_detail = $status_detail;
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
     * @return VoucherPurchase
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
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
     * @return VoucherPurchase
     */
    public function setValue($value)
    {
        $this->value = $value;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCaptured()
    {
        return $this->captured;
    }

    /**
     * @param mixed $captured
     * @return VoucherPurchase
     */
    public function setCaptured($captured)
    {
        $this->captured = $captured;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCapturedAmount()
    {
        return $this->captured_amount;
    }

    /**
     * @param mixed $captured_amount
     * @return VoucherPurchase
     */
    public function setCapturedAmount($captured_amount)
    {
        $this->captured_amount = $captured_amount;
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
     * @return VoucherPurchase
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
     * @return VoucherPurchase
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
     * @return VoucherPurchase
     */
    public function setTransactionId($transactionId)
    {
        $this->transactionId = $transactionId;
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
     * @return VoucherPurchase
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
     * @return VoucherPurchase
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return array
     */
    public function extract()
    {
        $array = get_object_vars($this);

        unset($array['table']);
        unset($array['primaryKey']);

        return $array;
    }
}