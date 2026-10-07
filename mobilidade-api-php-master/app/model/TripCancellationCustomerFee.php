<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/04/2019
 * Time: 18:48
 */
class TripCancellationCustomerFee extends BaseModel
{
    protected $id;
    protected $tripReference;
    protected $feeValue;
    protected $userId;
    protected $driverId;
    protected $tripCancellationFeeTypeId;
    protected $statusId;
    protected $paid_tripReference;
    protected $created_at;
    protected $updated_at;
    protected $scheduledPaymentDate;

    protected $primaryKey = 'id';

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);
        $this->updated_at = now();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return TripCancellationCustomerFee
     */
    public function setId($id)
    {
        $this->id = $id;
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
     * @return TripCancellationCustomerFee
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFeeValue()
    {
        return $this->feeValue;
    }

    /**
     * @param mixed $feeValue
     * @return TripCancellationCustomerFee
     */
    public function setFeeValue($feeValue)
    {
        $this->feeValue = $feeValue;
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
     * @return TripCancellationCustomerFee
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
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
     * @return TripCancellationCustomerFee
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripCancellationFeeTypeId()
    {
        return $this->tripCancellationFeeTypeId;
    }

    /**
     * @param mixed $tripCancellationFeeTypeId
     * @return TripCancellationCustomerFee
     */
    public function setTripCancellationFeeTypeId($tripCancellationFeeTypeId)
    {
        $this->tripCancellationFeeTypeId = $tripCancellationFeeTypeId;
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
     * @return TripCancellationCustomerFee
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPaidTripReference()
    {
        return $this->paid_tripReference;
    }

    /**
     * @param mixed $paid_tripReference
     * @return TripCancellationCustomerFee
     */
    public function setPaidTripReference($paid_tripReference)
    {
        $this->paid_tripReference = $paid_tripReference;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param false|string $created_at
     * @return TripCancellationCustomerFee
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param false|string $updated_at
     * @return TripCancellationCustomerFee
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getScheduledPaymentDate()
    {
        return $this->scheduledPaymentDate;
    }

    /**
     * @param mixed $scheduledPaymentDate
     * @return TripCancellationCustomerFee
     */
    public function setScheduledPaymentDate($scheduledPaymentDate)
    {
        $this->scheduledPaymentDate = $scheduledPaymentDate;
        return $this;
    }

}