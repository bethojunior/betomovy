<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 16/07/2018
 * Time: 15:54
 */
class DriverLocation extends BaseModel
{
    protected $idDriverLocation;
    protected $driverId;
    protected $statusId;
    protected $statusDriver;
    protected $login_at;
    protected $logout_at;
    protected $cooperativeId;

    /**
     * @return mixed
     */
    public function getIdDriverLocation()
    {
        return $this->idDriverLocation;
    }

    /**
     * @param mixed $idDriverLocation
     */
    public function setIdDriverLocation($idDriverLocation)
    {
        $this->idDriverLocation = $idDriverLocation;
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
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
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
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
    }

    /**
     * @return mixed
     */
    public function getStatusDriver()
    {
        return $this->statusDriver;
    }

    /**
     * @param mixed $statusDriver
     */
    public function setStatusDriver($statusDriver)
    {
        $this->statusDriver = $statusDriver;
    }

    /**
     * @return mixed
     */
    public function getLoginAt()
    {
        return $this->login_at;
    }

    /**
     * @param mixed $login_at
     */
    public function setLoginAt($login_at)
    {
        $this->login_at = $login_at;
    }

    /**
     * @return mixed
     */
    public function getLogoutAt()
    {
        return $this->logout_at;
    }

    /**
     * @param mixed $logout_at
     */
    public function setLogoutAt($logout_at)
    {
        $this->logout_at = $logout_at;
    }

    /**
     * @return mixed
     */
    public function getCooperativeId()
    {
        return $this->cooperativeId;
    }

    /**
     * @param mixed $cooperativeId
     */
    public function setCooperativeId($cooperativeId)
    {
        $this->cooperativeId = $cooperativeId;
    }

}