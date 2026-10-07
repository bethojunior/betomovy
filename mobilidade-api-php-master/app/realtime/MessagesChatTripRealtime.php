<?php

namespace app\realtime;

use app\model\Config;
use app\utils\CloudFirestore;
use DateTime;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/04/2019
 * Time: 16:02
 */
class MessagesChatTripRealtime extends CloudFirestore
{
    protected $collection = 'messagesChatTrip';

    protected $message;
    protected $userId;
    protected $chatTripId;
    /**
     * @var DateTime $date
     */
    protected $date;
    protected $isAudio;
    protected $tripReference;
    protected $userWhoReceivedId;
    protected $customerUserId;
    protected $driverUserId;

    /**
     * @return mixed
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param mixed $message
     * @return MessagesChatTripRealtime
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
     * @return MessagesChatTripRealtime
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getChatTripId()
    {
        return $this->chatTripId;
    }

    /**
     * @param mixed $chatTripId
     * @return MessagesChatTripRealtime
     */
    public function setChatTripId($chatTripId)
    {
        $this->chatTripId = $chatTripId;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getDate(): DateTime
    {
        return $this->date;
    }

    /**
     * @param DateTime $date
     * @return MessagesChatTripRealtime
     */
    public function setDate(DateTime $date): MessagesChatTripRealtime
    {
        $this->date = $date;
        return $this;
    }

    /**
     * @return mixed
     */
    public function isAudio()
    {
        return $this->isAudio;
    }

    /**
     * @param mixed $isAudio
     * @return MessagesChatTripRealtime
     */
    public function setIsAudio($isAudio)
    {
        $this->isAudio = $isAudio;
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
     * @return MessagesChatTripRealtime
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserWhoReceivedId()
    {
        return $this->userWhoReceivedId;
    }

    /**
     * @param mixed $userWhoReceivedId
     * @return MessagesChatTripRealtime
     */
    public function setUserWhoReceivedId($userWhoReceivedId)
    {
        $this->userWhoReceivedId = $userWhoReceivedId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCustomerUserId()
    {
        return $this->customerUserId;
    }

    /**
     * @param mixed $customerUserId
     * @return MessagesChatTripRealtime
     */
    public function setCustomerUserId($customerUserId)
    {
        $this->customerUserId = $customerUserId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverUserId()
    {
        return $this->driverUserId;
    }

    /**
     * @param mixed $driverUserId
     * @return MessagesChatTripRealtime
     */
    public function setDriverUserId($driverUserId)
    {
        $this->driverUserId = $driverUserId;
        return $this;
    }

    public function deleteAll($tripReference)
    {
        $this->deleteMany('tripReference', '=', $tripReference);

        return true;
    }
}