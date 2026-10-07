<?php


namespace app\model;

use app\utils\BaseModel;

class NotifyMapServiceAlert extends BaseModel
{
    protected $id;
    protected $message;
    protected $type;
    protected $service;
    protected $token;
    protected $created_at;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
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
     * @return NotifyMapServiceAlert
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param mixed $message
     * @return NotifyMapServiceAlert
     */
    public function setMessage($message)
    {
        $this->message = $message;
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
     * @return NotifyMapServiceAlert
     */
    public function setType($type)
    {
        $this->type = $type;
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
     * @return NotifyMapServiceAlert
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getService()
    {
        return $this->service;
    }

    /**
     * @param mixed $service
     * @return NotifyMapServiceAlert
     */
    public function setService($service)
    {
        $this->service = $service;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getToken()
    {
        return $this->token;
    }

    /**
     * @param mixed $token
     * @return NotifyMapServiceAlert
     */
    public function setToken($token)
    {
        $this->token = $token;
        return $this;
    }

}