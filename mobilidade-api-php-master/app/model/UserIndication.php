<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 11:20
 */
class UserIndication extends BaseModel
{
    protected $id;
    protected $userIndicatedId;
    protected $whoIndicatedId;
    protected $statusId;
    protected $created_at;
    protected $updated_at;
    protected $refund_to_fees_up_to;

    protected $primaryKey = 'id';

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);
        $this->updated_at = now();
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
     * @return UserIndication
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserIndicatedId()
    {
        return $this->userIndicatedId;
    }

    /**
     * @param mixed $userIndicatedId
     * @return UserIndication
     */
    public function setUserIndicatedId($userIndicatedId)
    {
        $this->userIndicatedId = $userIndicatedId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getWhoIndicatedId()
    {
        return $this->whoIndicatedId;
    }

    /**
     * @param mixed $whoIndicatedId
     * @return UserIndication
     */
    public function setWhoIndicatedId($whoIndicatedId)
    {
        $this->whoIndicatedId = $whoIndicatedId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatusId()
    {
        return $this->statusId;
    }

    /**
     * @param mixed $statusId
     * @return UserIndication
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
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
     * @return UserIndication
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
     * @return UserIndication
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRefundToFeesUpTo()
    {
        return $this->refund_to_fees_up_to;
    }

    /**
     * @param mixed $refund_to_fees_up_to
     * @return UserIndication
     */
    public function setRefundToFeesUpTo($refund_to_fees_up_to)
    {
        $this->refund_to_fees_up_to = $refund_to_fees_up_to;
        return $this;
    }
}