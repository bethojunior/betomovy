<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2019
 * Time: 14:40
 */
class DriverOnlineTime extends BaseModel
{
    protected $idDriverOnlineTime;
    protected $driverId;
    protected $time_in;
    protected $time_out;
    protected $statusId;

    public function __construct($obj = null)
    {
        $this->time_in = $obj->time_in ?? now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdDriverOnlineTime()
    {
        return $this->idDriverOnlineTime;
    }

    /**
     * @param mixed $idDriverOnlineTime
     * @return DriverOnlineTime
     */
    public function setIdDriverOnlineTime($idDriverOnlineTime)
    {
        $this->idDriverOnlineTime = $idDriverOnlineTime;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverId()
    {
        return $this->driverId;
    }

    /**
     * @param mixed $driverId
     * @return DriverOnlineTime
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTimeIn()
    {
        return $this->time_in;
    }

    /**
     * @param mixed $time_in
     * @return DriverOnlineTime
     */
    public function setTimeIn($time_in)
    {
        $this->time_in = $time_in;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTimeOut()
    {
        return $this->time_out;
    }

    /**
     * @param mixed $time_out
     * @return DriverOnlineTime
     */
    public function setTimeOut($time_out)
    {
        $this->time_out = $time_out;
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
     * @return DriverOnlineTime
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}