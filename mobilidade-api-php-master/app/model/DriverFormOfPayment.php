<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/07/2020
 * Time: 10:28
 */
class DriverFormOfPayment extends BaseModel
{
    protected $id;
    protected $driverId;
    protected $tripPaymentFormId;
    protected $created_at;
    protected $updated_at;
    protected $deleted_at;

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
     * @return DriverFormOfPayment
     */
    public function setId($id)
    {
        $this->id = $id;
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
     * @return DriverFormOfPayment
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripPaymentFormId()
    {
        return $this->tripPaymentFormId;
    }

    /**
     * @param mixed $tripPaymentFormId
     * @return DriverFormOfPayment
     */
    public function setTripPaymentFormId($tripPaymentFormId)
    {
        $this->tripPaymentFormId = $tripPaymentFormId;
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
     * @return DriverFormOfPayment
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
     * @return DriverFormOfPayment
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDeletedAt()
    {
        return $this->deleted_at;
    }

    /**
     * @param mixed $deleted_at
     * @return DriverFormOfPayment
     */
    public function setDeletedAt($deleted_at)
    {
        $this->deleted_at = $deleted_at;
        return $this;
    }

}