<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/07/2019
 * Time: 17:33
 */
class CustomerIndication extends BaseModel
{
    protected $id;
    protected $indicatedId;
    protected $whoIndicatedId;
    protected $statusId;
    protected $created_at;
    protected $updated_at;

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
     * @return CustomerIndication
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIndicatedId()
    {
        return $this->indicatedId;
    }

    /**
     * @param mixed $indicatedId
     * @return CustomerIndication
     */
    public function setIndicatedId($indicatedId)
    {
        $this->indicatedId = $indicatedId;
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
     * @return CustomerIndication
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
     * @return CustomerIndication
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param false|string $created_at
     * @return CustomerIndication
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param false|string $updated_at
     * @return CustomerIndication
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

}