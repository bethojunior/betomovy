<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/11/2018
 * Time: 14:28
 */
class ContactUs extends BaseModel
{
    protected $idContactUs;
    protected $message;
    protected $userId;
    protected $userTypeId;
    protected $statusId;
    protected $created_at;
    protected $updated_at;

    protected $table = "contactUs";

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        $this->updated_at = $obj->updated_at ?? now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdContactUs()
    {
        return $this->idContactUs;
    }

    /**
     * @param mixed $idContactUs
     * @return ContactUs
     */
    public function setIdContactUs($idContactUs)
    {
        $this->idContactUs = $idContactUs;
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
     * @return ContactUs
     */
    public function setMessage($message)
    {
        $this->message = $message;
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
     * @return ContactUs
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserTypeId()
    {
        return $this->userTypeId;
    }

    /**
     * @param mixed $userTypeId
     * @return ContactUs
     */
    public function setUserTypeId($userTypeId)
    {
        $this->userTypeId = $userTypeId;
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
     * @return ContactUs
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
     * @return ContactUs
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
     * @return ContactUs
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

}