<?php
/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 10/08/2018
 * Time: 18:02
 */

namespace app\model;

use app\constant\TransactionConst;
use app\utils\BaseModel;
use app\utils\UUID;

class Transaction extends BaseModel
{
    protected $idTransaction;
    protected $value;
    protected $intermediary_fee;
    protected $generatedPaymentId;
    protected $transactionStatusId;
    protected $status;
    protected $status_detailed;
    protected $paymentFormId;
    protected $created_at;
    protected $updated_at;
    protected $intermediaryId;
    protected $userId;
    protected $payment_code;
    protected $typeId;

    public function __construct($obj = null)
    {
        $this->idTransaction = $obj->idTransaction ?? UUID::v4();
        $this->created_at = $obj->created_at ?? now();

        parent::__construct($obj);

        $this->updated_at = now();
    }

    /**
     * @return string
     */
    public function getIdTransaction(): string
    {
        return $this->idTransaction;
    }

    /**
     * @param string $idTransaction
     * @return Transaction
     */
    public function setIdTransaction(string $idTransaction): Transaction
    {
        $this->idTransaction = $idTransaction;
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
     * @return Transaction
     */
    public function setValue($value)
    {
        $this->value = $value;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIntermediaryFee()
    {
        return $this->intermediary_fee;
    }

    /**
     * @param mixed $intermediary_fee
     * @return Transaction
     */
    public function setIntermediaryFee($intermediary_fee)
    {
        $this->intermediary_fee = $intermediary_fee;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getGeneratedPaymentId()
    {
        return $this->generatedPaymentId;
    }

    /**
     * @param mixed $generatedPaymentId
     * @return Transaction
     */
    public function setGeneratedPaymentId($generatedPaymentId)
    {
        $this->generatedPaymentId = $generatedPaymentId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTransactionStatusId()
    {
        return $this->transactionStatusId;
    }

    /**
     * @param mixed $transactionStatusId
     * @return Transaction
     */
    public function setTransactionStatusId($transactionStatusId)
    {
        $this->transactionStatusId = $transactionStatusId;
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
     * @return Transaction
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatusDetailed()
    {
        return $this->status_detailed;
    }

    /**
     * @param mixed $status_detailed
     * @return Transaction
     */
    public function setStatusDetailed($status_detailed)
    {
        $this->status_detailed = $status_detailed;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPaymentFormId()
    {
        return $this->paymentFormId;
    }

    /**
     * @param mixed $paymentFormId
     * @return Transaction
     */
    public function setPaymentFormId($paymentFormId)
    {
        $this->paymentFormId = $paymentFormId;
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
     * @return Transaction
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
     * @return Transaction
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIntermediaryId()
    {
        return $this->intermediaryId;
    }

    /**
     * @param mixed $intermediaryId
     * @return Transaction
     */
    public function setIntermediaryId($intermediaryId)
    {
        $this->intermediaryId = $intermediaryId;
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
     * @return Transaction
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTypeId()
    {
        return $this->typeId;
    }

    /**
     * @param mixed $typeId
     * @return Transaction
     */
    public function setTypeId($typeId)
    {
        $this->typeId = $typeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPaymentCode()
    {
        return $this->payment_code;
    }

    /**
     * @param mixed $paymentCode
     * @return Transaction
     */
    public function setPaymentCode(string $paymentCode)
    {
        $this->payment_code = $paymentCode;
        return $this;
    }

    public function extract()
    {
        $array = get_object_vars($this);

        unset($array['table']);
        unset($array['primaryKey']);

        return $array;
    }

    public function isCompleted(): bool
    {
        return (int) $this->getTransactionStatusId() === TransactionConst::COMPLETED;
    }
}