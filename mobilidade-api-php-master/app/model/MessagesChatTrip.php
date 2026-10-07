<?php

namespace app\model;

use app\utils\BaseModel;
use app\utils\UUID;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 07/08/2018
 * Time: 08:59
 */
class MessagesChatTrip extends BaseModel
{
    protected $idMessagesChatTrip;
    protected $message;
    protected $userId;
    protected $chatTripId;
    protected $isAudio;
    protected $date;

    protected $table = 'messagesChatTrip';

    public function __construct($obj = null)
    {
        if (empty($obj))
            $this->idMessagesChatTrip = UUID::v4();

        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdMessagesChatTrip()
    {
        return $this->idMessagesChatTrip;
    }

    /**
     * @param mixed $idMessagesChatTrip
     */
    public function setIdMessagesChatTrip($idMessagesChatTrip): void
    {
        $this->idMessagesChatTrip = $idMessagesChatTrip;
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
     */
    public function setMessage($message): void
    {
        $this->message = $message;
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
     */
    public function setUserId($userId): void
    {
        $this->userId = $userId;
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
     */
    public function setChatTripId($chatTripId): void
    {
        $this->chatTripId = $chatTripId;
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
     */
    public function setDate($date): void
    {
        $this->date = $date;
    }

    /**
     * @return mixed
     */
    public function getIsAudio()
    {
        return $this->isAudio;
    }

    /**
     * @param mixed $isAudio
     */
    public function setIsAudio($isAudio): void
    {
        $this->isAudio = $isAudio;
    }


}