<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 10/08/2018
 * Time: 18:05
 */
class Balance extends BaseModel
{
    protected $idBalance;
    protected $tripBalance;
    protected $blockedBalance;
    protected $balance;
    protected $withheldBalance;
    protected $blockedBalanceToPay;

    public function __construct($obj = null)
    {
        if (empty($obj)) {
            $this->tripBalance = 0;
            $this->balance = 0;
            $this->blockedBalance = 0;
            $this->withheldBalance = 0;
            $this->blockedBalanceToPay = 0;
        }

        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdBalance()
    {
        return $this->idBalance;
    }

    /**
     * @param mixed $idBalance
     */
    public function setIdBalance($idBalance)
    {
        $this->idBalance = $idBalance;
    }

    /**
     * @return mixed
     */
    public function getTripBalance()
    {
        return $this->tripBalance;
    }

    /**
     * @param mixed $tripBalance
     */
    public function setTripBalance($tripBalance)
    {
        $this->tripBalance = $tripBalance;
    }

    /**
     * @return mixed
     */
    public function getBlockedBalance()
    {
        return $this->blockedBalance;
    }

    /**
     * @param mixed $blockedBalance
     * @return Balance
     */
    public function setBlockedBalance($blockedBalance)
    {
        $this->blockedBalance = $blockedBalance;
        return $this;
    }

    /**
     * @return int
     */
    public function getBalance(): int
    {
        return $this->balance;
    }

    /**
     * @param int $balance
     * @return Balance
     */
    public function setBalance(int $balance): Balance
    {
        $this->balance = $balance;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getWithheldBalance()
    {
        return $this->withheldBalance;
    }

    /**
     * @param mixed $withheldBalance
     * @return Balance
     */
    public function setWithheldBalance($withheldBalance)
    {
        $this->withheldBalance = $withheldBalance;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBlockedBalanceToPay()
    {
        return $this->blockedBalanceToPay;
    }

    /**
     * @param mixed $blockedBalanceToPay
     * @return Balance
     */
    public function setBlockedBalanceToPay($blockedBalanceToPay)
    {
        $this->blockedBalanceToPay = $blockedBalanceToPay;
        return $this;
    }

}