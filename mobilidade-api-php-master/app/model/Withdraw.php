<?php

namespace app\model;

use app\utils\BaseModel;
use app\utils\UUID;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/09/2018
 * Time: 11:18
 */
class Withdraw extends BaseModel
{
    protected $idWithdraw;
    protected $value;
    protected $created_at;
    protected $paid;
    protected $paymentDate;
    protected $bankAccount;
    protected $paidByUser;
    protected $balanceId;
    protected $userId;
    protected $confirmationCode;

    public function __construct($obj = null)
    {
        $this->created_at = now();
        $this->confirmationCode = $obj->confirmationCode ?? $this->generateConfirmationCode();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdWithdraw()
    {
        return $this->idWithdraw;
    }

    /**
     * @param mixed $idWithdraw
     * @return Withdraw
     */
    public function setIdWithdraw($idWithdraw)
    {
        $this->idWithdraw = $idWithdraw;
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
     * @return Withdraw
     */
    public function setValue($value)
    {
        $this->value = $value;
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
     * @return Withdraw
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPaid()
    {
        return $this->paid;
    }

    /**
     * @param mixed $paid
     * @return Withdraw
     */
    public function setPaid($paid)
    {
        $this->paid = $paid;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPaymentDate()
    {
        return $this->paymentDate;
    }

    /**
     * @param mixed $paymentDate
     * @return Withdraw
     */
    public function setPaymentDate($paymentDate)
    {
        $this->paymentDate = $paymentDate;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBankAccount()
    {
        return $this->bankAccount;
    }

    /**
     * @param mixed $bankAccount
     * @return Withdraw
     */
    public function setBankAccount($bankAccount)
    {
        $this->bankAccount = $bankAccount;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPaidByUser()
    {
        return $this->paidByUser;
    }

    /**
     * @param mixed $paidByUser
     * @return Withdraw
     */
    public function setPaidByUser($paidByUser)
    {
        $this->paidByUser = $paidByUser;
        return $this;
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
     * @return Withdraw
     */
    public function setBalanceId($balanceId)
    {
        $this->balanceId = $balanceId;
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
     * @return Withdraw
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return string
     */
    public function getConfirmationCode(): string
    {
        return $this->confirmationCode;
    }

    /**
     * @param string $confirmationCode
     * @return Withdraw
     */
    public function setConfirmationCode(string $confirmationCode): Withdraw
    {
        $this->confirmationCode = $confirmationCode;
        return $this;
    }

    /**
     * Essa função esconde o valor original. Para o código de confirmação ser válido terá de passar
     * pelo algoritmo para fazer a "limpeza";
     *
     * O algoritmo deve trocar o segundo grupo de caracteres com o quarto grupo
     *
     * @return string
     */
    public function getMessConfirmationCode()
    {
        $code = explode('-', $this->confirmationCode);

        $aux = $code[1];
        $code[1] = $code[3];
        $code[3] = $aux;

        return implode('-', $code);
    }

    /**
     * @return string
     */
    private function generateConfirmationCode()
    {
        return UUID::v4();
    }
}