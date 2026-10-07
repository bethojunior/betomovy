<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/09/2018
 * Time: 14:14
 */
class DriverStation extends BaseModel
{
    protected $idDriverStation;
    protected $stationId;
    protected $driverId;

    /**
     * @return mixed
     */
    public function getIdDriverStation()
    {
        return $this->idDriverStation;
    }

    /**
     * @param mixed $idDriverStation
     * @return DriverStation
     */
    public function setIdDriverStation($idDriverStation)
    {
        $this->idDriverStation = $idDriverStation;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStationId()
    {
        return $this->stationId;
    }

    /**
     * @param mixed $stationId
     * @return DriverStation
     */
    public function setStationId($stationId)
    {
        $this->stationId = $stationId;
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
     * @return DriverStation
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
        return $this;
    }

}