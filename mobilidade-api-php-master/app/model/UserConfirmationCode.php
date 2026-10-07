<?php

namespace app\model;

use app\utils\BaseModel;

class UserConfirmationCode extends BaseModel
{
    protected $primaryKey = 'id';

    protected $table = 'userConfirmationCode';

    protected $id;
    protected $code;
    protected $userId;
    protected $type;
    protected $validUntil;
    protected $data;
    protected $created_at;
    protected $updated_at;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        $this->updated_at = $obj->updated_at ?? now();
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
     * @return UserConfirmationCode
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * @param mixed $code
     * @return UserConfirmationCode
     */
    public function setCode($code)
    {
        $this->code = $code;
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
     * @return UserConfirmationCode
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     * @return UserConfirmationCode
     */
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getValidUntil()
    {
        return $this->validUntil;
    }

    /**
     * @param mixed $validUntil
     * @return UserConfirmationCode
     */
    public function setValidUntil($validUntil)
    {
        $this->validUntil = $validUntil;
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
     * @return UserConfirmationCode
     */
    public function setData($data)
    {
        $this->data = $data;
        return $this;
    }
}