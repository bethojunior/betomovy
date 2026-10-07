<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 11:22
 */
class Bank extends BaseModel
{
    protected $idBank;
    protected $bankNumber;
    protected $bankName;

    /**
     * @return mixed
     */
    public function getIdBank()
    {
        return $this->idBank;
    }

    /**
     * @param mixed $idBank
     */
    public function setIdBank($idBank)
    {
        $this->idBank = $idBank;
    }

    /**
     * @return mixed
     */
    public function getBankNumber()
    {
        return $this->bankNumber;
    }

    /**
     * @param mixed $bankNumber
     */
    public function setBankNumber($bankNumber)
    {
        $this->bankNumber = $bankNumber;
    }

    /**
     * @return mixed
     */
    public function getBankName()
    {
        return $this->bankName;
    }

    /**
     * @param mixed $bankName
     */
    public function setBankName($bankName)
    {
        $this->bankName = $bankName;
    }

}