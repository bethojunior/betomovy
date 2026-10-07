<?php

namespace app\model;

use app\utils\BaseModel;

class Notification extends BaseModel
{
    protected $table = 'notification';
    protected $title;
    protected $message;
    protected $link;
    protected $image;
    protected $notificationTypeId;
    protected $date;
    protected $dateSend;
    protected $userTypeId;
    protected $statusId;
    protected $userIdAdministrator;
    protected $usersId;
    protected $cityId;
    protected $identifyUserInLink;

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     * @return Notification
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
     * @return Notification
     */
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLink()
    {
        return $this->link;
    }

    /**
     * @param mixed $link
     * @return Notification
     */
    public function setLink($link)
    {
        $this->link = $link;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param mixed $image
     * @return Notification
     */
    public function setImage($image)
    {
        $this->image = $image;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getNotificationTypeId()
    {
        return $this->notificationTypeId;
    }

    /**
     * @param mixed $notificationTypeId
     * @return Notification
     */
    public function setNotificationTypeId($notificationTypeId)
    {
        $this->notificationTypeId = $notificationTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     * @return Notification
     */
    public function setDate($date)
    {
        $this->date = $date;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDateSend()
    {
        return $this->dateSend;
    }

    /**
     * @param mixed $dateSend
     * @return Notification
     */
    public function setDateSend($dateSend)
    {
        $this->dateSend = $dateSend;
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
     * @return Notification
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
     * @return Notification
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserIdAdministrator()
    {
        return $this->userIdAdministrator;
    }

    /**
     * @param mixed $userIdAdministrator
     * @return Notification
     */
    public function setUserIdAdministrator($userIdAdministrator)
    {
        $this->userIdAdministrator = $userIdAdministrator;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUsersId()
    {
        return $this->usersId;
    }

    /**
     * @param mixed $usersId
     * @return Notification
     */
    public function setUsersId($usersId)
    {
        $this->usersId = $usersId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCityId()
    {
        return $this->cityId;
    }

    /**
     * @param mixed $cityId
     * @return Notification
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIdentifyUserInLink()
    {
        return $this->identifyUserInLink;
    }

    /**
     * @param mixed $identifyUserInLink
     * @return Notification
     */
    public function setIdentifyUserInLink($identifyUserInLink)
    {
        $this->identifyUserInLink = $identifyUserInLink;
        return $this;
    }
}