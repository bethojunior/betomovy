<?php

namespace app\model;

use app\utils\BaseModel;
// use MongoDB\BSON\UTCDateTime;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/12/2018
 * Time: 10:37
 */
class TransactionLog extends BaseModel
{
    protected $idReference;
    protected $userId;
    protected $data;
    protected $created_at;

    public function __construct($obj = null)
    {
        $this->created_at = now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdReference()
    {
        return $this->idReference;
    }

    /**
     * @param mixed $idReference
     * @return TransactionLog
     */
    public function setIdReference($idReference)
    {
        $this->idReference = $idReference;
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
     * @return TransactionLog
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @param mixed $data
     * @return TransactionLog
     */
    public function setData($data)
    {
        $this->data = $data;
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
     * @return TransactionLog
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

}
