<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/12/2018
 * Time: 16:23
 */
class TripCardPayment extends BaseModel
{

    const CAPTURADO = 1;
    const CAPTURE = 2;

    protected $idTripCardPayment;
    protected $tripReference;
    protected $status;
    protected $status_detail;
    protected $amount;
    protected $captured;
    protected $cardId;
    protected $userId;
    protected $transactionId;
    protected $intermediaryId;
    protected $created_at;
    protected $updated_at;

    protected $table = 'tripCardPayment';

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);
        $this->updated_at = now();
    }

    /**
     * @return mixed
     */
    public function getIdTripCardPayment()
    {
        return $this->idTripCardPayment;
    }

    /**
     * @param mixed $idTripCardPayment
     * @return TripCardPayment
     */
    public function setIdTripCardPayment($idTripCardPayment)
    {
        $this->idTripCardPayment = $idTripCardPayment;
        return $this;
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
     * @return TripCardPayment
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
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
     * @return TripCardPayment
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
     * @return TripCardPayment
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
     * @return TripCardPayment
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
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
     * @return TripCardPayment
     */
    public function setCaptured($captured)
    {
        $this->captured = $captured;
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
     * @return TripCardPayment
     */
    public function setCardId($cardId)
    {
        $this->cardId = $cardId;
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
     * @return TripCardPayment
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
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
     * @return TripCardPayment
     */
    public function setTransactionId($transactionId)
    {
        $this->transactionId = $transactionId;
        return $this;
    }

    /**
     * Apenas uso interno para controle de transações.
     * 
     * @return mixed
     */
    public function getIntermediaryId()
    {
        return $this->intermediaryId;
    }

    /**
     * @param mixed $intermediaryId
     * @return TripCardPayment
     */
    public function setIntermediaryId(int $intermediaryId)
    {
        $this->intermediaryId = $intermediaryId;
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
     * @return TripCardPayment
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
     * @return TripCardPayment
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
        unset($array['intermediaryId']);

        return $array;
    }

    public function toArray()
    {
        $data = parent::toArray();
        unset($data['intermediaryId']);
        return $data;
    }
}