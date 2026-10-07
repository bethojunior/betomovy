<?php

namespace app\model;

use app\utils\BaseModel;

class NotificationUser extends BaseModel
{
    protected $table = 'notificationUser';
    protected $userId;
    protected $notificationId;
    protected $viewed;
    protected $created_at;

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     * @return NotificationUser
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getNotificationId()
    {
        return $this->notificationId;
    }

    /**
     * @param mixed $notificationId
     * @return NotificationUser
     */
    public function setNotificationId($notificationId)
    {
        $this->notificationId = $notificationId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getViewed()
    {
        return $this->viewed;
    }

    /**
     * @param mixed $viewed
     * @return NotificationUser
     */
    public function setViewed($viewed)
    {
        $this->viewed = $viewed;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCreated_at()
    {
        return $this->created_at;
    }

    /**
     * @param mixed $getCreated_at
     * @return NotificationUser
     */
    public function setCreated_at($getCreated_at)
    {
        $this->created_at = $getCreated_at;
        return $this;
    }

}