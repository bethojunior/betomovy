<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/05/2019
 * Time: 16:40
 */
class Manager extends BaseModel
{
    protected $id;
    protected $balanceId;
    protected $managerRegisterStatusId;
    protected $valueCommission;
    protected $valueTypeCommission;
    protected $partnerCommission;
    protected $partnerTypeCommission;

    protected $primaryKey = 'id';

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return Manager
     */
    public function setId($id)
    {
        $this->id = $id;
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
     * @return Manager
     */
    public function setBalanceId($balanceId)
    {
        $this->balanceId = $balanceId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getManagerRegisterStatusId()
    {
        return $this->managerRegisterStatusId;
    }

    /**
     * @param mixed $managerRegisterStatusId
     * @return Manager
     */
    public function setManagerRegisterStatusId($managerRegisterStatusId)
    {
        $this->managerRegisterStatusId = $managerRegisterStatusId;
        return $this;
    }

}