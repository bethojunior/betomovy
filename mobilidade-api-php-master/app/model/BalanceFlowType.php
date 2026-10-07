<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 10/08/2018
 * Time: 18:09
 */
class BalanceFlowType extends BaseModel
{
    protected $table = "balanceFlowType";

    protected $idBalanceFlowType;
    protected $name;

    /**
     * @return mixed
     */
    public function getIdBalanceFlowType()
    {
        return $this->idBalanceFlowType;
    }

    /**
     * @param mixed $idBalanceFlowType
     */
    public function setIdBalanceFlowType($idBalanceFlowType)
    {
        $this->idBalanceFlowType = $idBalanceFlowType;
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