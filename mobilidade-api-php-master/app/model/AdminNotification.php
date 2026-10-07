<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/11/2019
 * Time: 17:51
 */
class AdminNotification extends BaseModel
{
    protected $id;
    protected $adminNotificationTypeId;
    protected $userGroupId;
    protected $title;
    protected $message;
    protected $picture;
    protected $userId;
    protected $ip;
    protected $lat;
    protected $lng;
    protected $tripReference;
    protected $emergencyMonitoringTypeId;
    protected $created_at;
    protected $updated_at;
    protected $cityId;

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
     * @return AdminNotification
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAdminNotificationTypeId()
    {
        return $this->adminNotificationTypeId;
    }

    /**
     * @param mixed $adminNotificationTypeId
     * @return AdminNotification
     */
    public function setAdminNotificationTypeId($adminNotificationTypeId)
    {
        $this->adminNotificationTypeId = $adminNotificationTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserGroupId()
    {
        return $this->userGroupId;
    }

    /**
     * @param mixed $userGroupId
     * @return AdminNotification
     */
    public function setUserGroupId($userGroupId)
    {
        $this->userGroupId = $userGroupId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     * @return AdminNotification
     */
    public function setTitle($title)
    {
        $this->title = $title;
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
     * @return AdminNotification
     */
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPicture()
    {
        return $this->picture;
    }

    /**
     * @param mixed $picture
     * @return AdminNotification
     */
    public function setPicture($picture)
    {
        $this->picture = $picture;
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
     * @return AdminNotification
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
     * @return AdminNotification
     */
    public function setIp($ip)
    {
        $this->ip = $ip;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLat()
    {
        return $this->lat;
    }

    /**
     * @param mixed $lat
     * @return AdminNotification
     */
    public function setLat($lat)
    {
        $this->lat = $lat;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLng()
    {
        return $this->lng;
    }

    /**
     * @param mixed $lng
     * @return AdminNotification
     */
    public function setLng($lng)
    {
        $this->lng = $lng;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripReference()
    {
        return $this->tripReference;
    }

    /**
     * @param mixed $tripReference
     * @return AdminNotification
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEmergencyMonitoringTypeId()
    {
        return $this->emergencyMonitoringTypeId;
    }

    /**
     * @param mixed $emergencyMonitoringTypeId
     * @return AdminNotification
     */
    public function setEmergencyMonitoringTypeId($emergencyMonitoringTypeId)
    {
        $this->emergencyMonitoringTypeId = $emergencyMonitoringTypeId;
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
     * @return AdminNotification
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
     * @return AdminNotification
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    public function getCityId()
    {
        return $this->cityId;
    }

    public function setCityId($cityId): AdminNotification
    {
        $this->cityId = $cityId;
        return $this;
    }
}