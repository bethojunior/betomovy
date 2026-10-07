<?php

namespace app\model;

use app\utils\BaseModel;
use app\utils\UUID;

class Log extends BaseModel
{
    protected $idLog;
    protected $logType;
    protected $registered_at;
    protected $date;
    protected $data;
    protected $message;
    protected $userId;
    protected $nameUser;
    protected $app;
    protected $idReference;
    protected $query;
    protected $dir;
    protected $level;
    protected $trace;

    public function __construct($logType = null, $level = LogCriticalType::INFORMACAO, $obj = null)
    {
        $this->idLog = UUID::v4();
        $this->date = now();
        $this->registered_at = now();
        $this->level = $level;

        if ($logType)
            $this->logType = $logType;

        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @param $data
     * @return $this
     */
    public function setData($data)
    {
        $this->data = $data;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getNameUser()
    {
        return $this->nameUser;
    }

    /**
     * @param $nameUser
     * @return $this
     */
    public function setNameUser($nameUser)
    {
        $this->nameUser = $nameUser;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getIdLog()
    {
        return $this->idLog;
    }

    /**
     * @param mixed $idLog
     */
    public function setIdLog($idLog)
    {
        $this->idLog = $idLog;
    }

    /**
     * @return mixed
     */
    public function getLogType()
    {
        return $this->logType;
    }

    /**
     * @param mixed $logType
     */
    public function setLogType($logType)
    {
        $this->logType = $logType;
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
    public function setDate($date)
    {
        $this->date = formatDateMongo($date);
    }

    /**
     * @return mixed
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param $message
     * @return $this
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
     * @param $userId
     * @return $this
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getApp()
    {
        return $this->app;
    }

    /**
     * @param $app
     * @return $this
     */
    public function setApp($app)
    {
        $this->app = $app;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getIdReference()
    {
        return $this->idReference;
    }

    /**
     * @param $idReference
     * @return $this
     */
    public function setIdReference($idReference)
    {
        $this->idReference = $idReference;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getQuery()
    {
        return $this->query;
    }

    /**
     * @param $query
     * @return $this
     */
    public function setQuery($query)
    {
        $this->query = $query;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getDir()
    {
        return $this->dir;
    }

    /**
     * @param $dir
     * @return $this
     */
    public function setDir($dir)
    {
        $this->dir = $dir;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getLevel()
    {
        return $this->level;
    }

    /**
     * @param $level
     * @return $this
     */
    public function setLevel($level)
    {
        $this->level = $level;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getTrace()
    {
        return $this->trace;
    }

    /**
     * @param mixed $trace
     * @return Log
     */
    public function setTrace($trace)
    {
        $this->trace = $trace;
        return $this;
    }
}
