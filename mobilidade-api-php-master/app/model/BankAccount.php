<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 11:22
 */
class BankAccount extends BaseModel
{
    protected $idBankAccount;
    protected $holderName;
    protected $document;
    protected $typeAccount;
    protected $agency;
    protected $agencyDigit;
    protected $op;
    protected $numberAccount;
    protected $numberAccountDigit;
    protected $bankId;
    protected $date;
    protected $pix;
    protected $pixType;

    protected $table = "bankAccount";

    public function __construct($obj = null)
    {
        $this->date = $obj->date ?? now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getHolderName()
    {
        return $this->holderName;
    }

    /**
     * @param mixed $holderName
     * @return BankAccount
     */
    public function setHolderName($holderName)
    {
        $this->holderName = $holderName;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * @param mixed $document
     * @return BankAccount
     */
    public function setDocument($document)
    {
        $this->document = $document;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIdBankAccount()
    {
        return $this->idBankAccount;
    }

    /**
     * @param mixed $idBankAccount
     */
    public function setIdBankAccount($idBankAccount)
    {
        $this->idBankAccount = $idBankAccount;
    }

    /**
     * @return mixed
     */
    public function getTypeAccount()
    {
        return $this->typeAccount;
    }

    /**
     * @param mixed $typeAccount
     */
    public function setTypeAccount($typeAccount)
    {
        $this->typeAccount = $typeAccount;
    }

    /**
     * @return mixed
     */
    public function getAgency()
    {
        return $this->agency;
    }

    /**
     * @param mixed $agency
     */
    public function setAgency($agency)
    {
        $this->agency = $agency;
    }

    /**
     * @return mixed
     */
    public function getAgencyDigit()
    {
        return $this->agencyDigit;
    }

    /**
     * @param mixed $agencyDigit
     * @return BankAccount
     */
    public function setAgencyDigit($agencyDigit)
    {
        $this->agencyDigit = $agencyDigit;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOp()
    {
        return $this->op;
    }

    /**
     * @param mixed $op
     */
    public function setOp($op)
    {
        $this->op = $op;
    }

    /**
     * @return mixed
     */
    public function getNumberAccount()
    {
        return $this->numberAccount;
    }

    /**
     * @param mixed $numberAccount
     */
    public function setNumberAccount($numberAccount)
    {
        $this->numberAccount = $numberAccount;
    }

    /**
     * @return mixed
     */
    public function getNumberAccountDigit()
    {
        return $this->numberAccountDigit;
    }

    /**
     * @param mixed $numberAccountDigit
     * @return BankAccount
     */
    public function setNumberAccountDigit($numberAccountDigit)
    {
        $this->numberAccountDigit = $numberAccountDigit;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBankId()
    {
        return $this->bankId;
    }

    /**
     * @param mixed $bankId
     */
    public function setBankId($bankId)
    {
        $this->bankId = $bankId;
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
     * @return array
     */
    public function extract()
    {
        return get_object_vars($this);
    }

    /**
     * @return mixed
     */
    public function getPix()
    {
        return $this->pix;
    }

    /**
     * @param mixed $pix
     */
    public function setPix($pix): void
    {
        $this->pix = $pix;
    }

    /**
     * @return mixed
     */
    public function getPixType()
    {
        return $this->pixType;
    }

    /**
     * @param mixed $pixType
     */
    public function setPixType($pixType): void
    {
        $this->pixType = $pixType;
    }


}