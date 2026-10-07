<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 10/08/2018
 * Time: 18:03
 */
class EstablishmentRecharge extends BaseModel
{
    protected $table = "establishmentRecharge";

    protected $idEstablishmentRecharge;
    protected $balance;
    protected $value;
    protected $date;
    protected $userId;
    protected $establishmentId;
    protected $transactionId;

    /**
     * @return mixed
     */
    public function getIdEstablishmentRecharge()
    {
        return $this->idEstablishmentRecharge;
    }

    /**
     * @param mixed $idEstablishmentRecharge
     */
    public function setIdEstablishmentRecharge($idEstablishmentRecharge)
    {
        $this->idEstablishmentRecharge = $idEstablishmentRecharge;
    }

    /**
     * @return mixed
     */
    public function getBalance()
    {
        return $this->balance;
    }

    /**
     * @param mixed $balance
     */
    public function setBalance($balance)
    {
        $this->balance = $balance;
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
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    /**
     * @return mixed
     */
    public function getEstablishmentId()
    {
        return $this->establishmentId;
    }

    /**
     * @param mixed $establishmentId
     */
    public function setEstablishmentId($establishmentId)
    {
        $this->establishmentId = $establishmentId;
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
     */
    public function setTransactionId($transactionId)
    {
        $this->transactionId = $transactionId;
    }

}