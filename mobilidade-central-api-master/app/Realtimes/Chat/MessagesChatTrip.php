<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 19:12
 */

namespace App\Realtimes\Chat;

class MessagesChatTrip
{
    protected $message;
    protected $userId;
    protected $chatTripId;
    /**
     * @var \DateTime $date
     */
    protected $date;
    protected $isAudio;
    protected $tripReference;
    protected $isCentral;
    protected $idMessagesChatTrip;

    /**
     * @return mixed
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param mixed $message
     * @return MessagesChatTrip
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
     * @return MessagesChatTrip
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
     * @return MessagesChatTrip
     */
    public function setChatTripId($chatTripId)
    {
        $this->chatTripId = $chatTripId;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getDate(): \DateTime
    {
        return $this->date;
    }

    /**
     * @param \DateTime $date
     * @return MessagesChatTrip
     */
    public function setDate(\DateTime $date): MessagesChatTrip
    {
        $this->date = $date;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getisAudio()
    {
        return $this->isAudio;
    }

    /**
     * @param mixed $isAudio
     * @return MessagesChatTrip
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
     * @return MessagesChatTrip
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function isCentral()
    {
        return $this->isCentral;
    }

    /**
     * @param mixed $isCentral
     * @return MessagesChatTrip
     */
    public function setIsCentral($isCentral)
    {
        $this->isCentral = $isCentral;
        return $this;
    }

    public function setIdMessagesChatTrip($idMessagesChatTrip)
    {
        $this->idMessagesChatTrip = $idMessagesChatTrip;
        return $this;
    }

    public function getIdMessagesChatTrip()
    {
        return $this->idMessagesChatTrip;
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
