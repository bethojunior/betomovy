<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/09/2018
 * Time: 09:17
 */
class PendencyReasons extends BaseModel
{
    protected $idPendencyReasons;
    protected $reason;
    protected $pendencyReasonsTypeId;
    protected $statusId;
    protected $driverId;
    protected $date;

    protected $table = 'pendencyReasons';

    /**
     * @return mixed
     */
    public function getIdPendencyReasons()
    {
        return $this->idPendencyReasons;
    }

    /**
     * @param mixed $idPendencyReasons
     * @return PendencyReasons
     */
    public function setIdPendencyReasons($idPendencyReasons)
    {
        $this->idPendencyReasons = $idPendencyReasons;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getReason()
    {
        return $this->reason;
    }

    /**
     * @param mixed $reason
     * @return PendencyReasons
     */
    public function setReason($reason)
    {
        $this->reason = $reason;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPendencyReasonsTypeId()
    {
        return $this->pendencyReasonsTypeId;
    }

    /**
     * @param mixed $pendencyReasonsTypeId
     * @return PendencyReasons
     */
    public function setPendencyReasonsTypeId($pendencyReasonsTypeId)
    {
        $this->pendencyReasonsTypeId = $pendencyReasonsTypeId;
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
     * @return PendencyReasons
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
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
     * @return PendencyReasons
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
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
     * @return PendencyReasons
     */
    public function setDate($date)
    {
        $this->date = $date;
        return $this;
    }

}