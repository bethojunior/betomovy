<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/01/2019
 * Time: 11:23
 */
class AppSharing extends BaseModel
{
    protected $idAppSharing;
    protected $type;
    protected $userId;
    protected $ip;
    protected $appId;
    protected $formOfSharing;
    protected $phone;
    protected $created_at;
    protected $latitude;
    protected $longitude;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdAppSharing()
    {
        return $this->idAppSharing;
    }

    /**
     * @param mixed $idAppSharing
     * @return AppSharing
     */
    public function setIdAppSharing($idAppSharing)
    {
        $this->idAppSharing = $idAppSharing;
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
     * @return AppSharing
     */
    public function setType($type)
    {
        $this->type = $type;
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
     * @return AppSharing
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIp()
    {
        return $this->ip;
    }

    /**
     * @param mixed $ip
     * @return AppSharing
     */
    public function setIp($ip)
    {
        $this->ip = $ip;
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
     * @return AppSharing
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAppId()
    {
        return $this->appId;
    }

    /**
     * @param mixed $appId
     * @return AppSharing
     */
    public function setAppId($appId)
    {
        $this->appId = $appId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFormOfSharing()
    {
        return $this->formOfSharing;
    }

    /**
     * @param mixed $formOfSharing
     * @return AppSharing
     */
    public function setFormOfSharing($formOfSharing)
    {
        $this->formOfSharing = $formOfSharing;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * @param mixed $phone
     * @return AppSharing
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLatitude()
    {
        return $this->latitude;
    }

    /**
     * @param mixed $latitude
     * @return AppSharing
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLongitude()
    {
        return $this->longitude;
    }

    /**
     * @param mixed $longitude
     * @return AppSharing
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;
        return $this;
    }

}