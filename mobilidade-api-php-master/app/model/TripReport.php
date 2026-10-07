<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/01/2019
 * Time: 21:29
 */
class TripReport extends BaseModel
{
    protected $idTripReport;
    protected $tripReference;
    protected $message;
    protected $userId;
    protected $statusId;
    protected $read;
    protected $tripReportTypeId;
    protected $cancellationReasonsId;
    protected $created_at;
    protected $updated_at;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();

        parent::__construct($obj);

        $this->updated_at = now();
    }

    /**
     * @return mixed
     */
    public function getIdTripReport()
    {
        return $this->idTripReport;
    }

    /**
     * @param mixed $idTripReport
     * @return TripReport
     */
    public function setIdTripReport($idTripReport)
    {
        $this->idTripReport = $idTripReport;
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
     * @return TripReport
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
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
     * @return TripReport
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
     * @return TripReport
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
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
     * @return TripReport
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripReportTypeId()
    {
        return $this->tripReportTypeId;
    }

    /**
     * @param mixed $tripReportTypeId
     * @return TripReport
     */
    public function setTripReportTypeId($tripReportTypeId)
    {
        $this->tripReportTypeId = $tripReportTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCancellationReasonsId()
    {
        return $this->cancellationReasonsId;
    }

    /**
     * @param mixed $cancellationReasonsId
     * @return TripReport
     */
    public function setCancellationReasonsId($cancellationReasonsId)
    {
        $this->cancellationReasonsId = $cancellationReasonsId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRead()
    {
        return $this->read;
    }

    /**
     * @param mixed $read
     * @return TripReport
     */
    public function setRead($read)
    {
        $this->read = $read;
        return $this;
    }

}