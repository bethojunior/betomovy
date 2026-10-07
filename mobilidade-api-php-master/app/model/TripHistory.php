<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 26/07/2018
 * Time: 09:29
 */
class TripHistory extends BaseModel
{
    const ACCEPTED = "accepted";
    const DENIED = "denied";

    protected $table = "tripHistory";

    protected $idTripHistory;
    protected $driverId;
    protected $driverBalanceInStartCall;
    protected $tripReference;
    protected $date;
    protected $status;
    protected $countDenied;

    public function __construct($obj = null)
    {
        if (!empty($obj))
            $obj->date = $obj->date ?? now();

        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getCountDenied()
    {
        return $this->countDenied;
    }

    /**
     * @param mixed $countDenied
     */
    public function setCountDenied($countDenied): void
    {
        $this->countDenied = $countDenied;
    }

    /**
     * @return mixed
     */
    public function getIdTripHistory()
    {
        return $this->idTripHistory;
    }

    /**
     * @param mixed $idTripHistory
     */
    public function setIdTripHistory($idTripHistory): void
    {
        $this->idTripHistory = $idTripHistory;
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
    public function setDriverId($driverId): void
    {
        $this->driverId = $driverId;
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
     */
    public function setTripReference($tripReference): void
    {
        $this->tripReference = $tripReference;
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
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status): void
    {
        $this->status = $status;
    }

    /**
     * @return mixed
     */
    public function getDriverBalanceInStartCall()
    {
        return $this->driverBalanceInStartCall;
    }

    /**
     * @param mixed $driverBalanceInStartCall
     */
    public function setDriverBalanceInStartCall($driverBalanceInStartCall): void
    {
        $this->driverBalanceInStartCall = $driverBalanceInStartCall;
    }

}