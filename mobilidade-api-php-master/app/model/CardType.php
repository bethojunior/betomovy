<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 10/08/2018
 * Time: 18:13
 */
class CardType extends BaseModel
{
    const CREDIT = 1;
    const DEBIT = 2;

    protected $table = "cardType";

    protected $idCardType;
    protected $name;

    /**
     * @return mixed
     */
    public function getIdCardType()
    {
        return $this->idCardType;
    }

    /**
     * @param mixed $idCardType
     */
    public function setIdCardType($idCardType)
    {
        $this->idCardType = $idCardType;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

}