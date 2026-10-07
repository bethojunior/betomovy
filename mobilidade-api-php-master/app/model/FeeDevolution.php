<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/06/2019
 * Time: 18:23
 */
class FeeDevolution extends BaseModel
{
    protected $id;
    protected $balanceFlowId;
    protected $registered_at;

    public function __construct($obj = null)
    {
        $this->registered_at = $obj->registered_at ?? now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return FeeDevolution
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBalanceFlowId()
    {
        return $this->balanceFlowId;
    }

    /**
     * @param mixed $balanceFlowId
     * @return FeeDevolution
     */
    public function setBalanceFlowId($balanceFlowId)
    {
        $this->balanceFlowId = $balanceFlowId;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getRegisteredAt()
    {
        return $this->registered_at;
    }

    /**
     * @param false|string $registered_at
     * @return FeeDevolution
     */
    public function setRegisteredAt($registered_at)
    {
        $this->registered_at = $registered_at;
        return $this;
    }

}