<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/03/2020
 * Time: 14:55
 */
class ExternalServiceUse extends BaseModel
{
    protected $id;
    protected $externalServiceId;
    protected $externalServiceActionId;
    protected $message;
    protected $to;
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
     * @return ExternalServiceUse
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getExternalServiceId()
    {
        return $this->externalServiceId;
    }

    /**
     * @param mixed $externalServiceId
     * @return ExternalServiceUse
     */
    public function setExternalServiceId($externalServiceId)
    {
        $this->externalServiceId = $externalServiceId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getExternalServiceActionId()
    {
        return $this->externalServiceActionId;
    }

    /**
     * @param mixed $externalServiceActionId
     * @return ExternalServiceUse
     */
    public function setExternalServiceActionId($externalServiceActionId)
    {
        $this->externalServiceActionId = $externalServiceActionId;
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
     * @return ExternalServiceUse
     */
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTo()
    {
        return $this->to;
    }

    /**
     * @param mixed $to
     * @return ExternalServiceUse
     */
    public function setTo($to)
    {
        $this->to = $to;
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
     * @return ExternalServiceUse
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

}