<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 11:38
 */
class Employee extends BaseModel
{
    protected $idEmployee;
    protected $occupation;
    protected $commission;
    protected $userId;
    protected $establishmentId;
    protected $statusId;
    protected $created_at;
    protected $updated_at;
    protected $balanceId;

    public function __construct($obj = null)
    {
        if (!empty($obj)) {
            $this->updated_at = $obj->updated_at ?? now();
            $this->created_at = $obj->created_at ?? now();
        }
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdEmployee()
    {
        return $this->idEmployee;
    }

    /**
     * @param mixed $idEmployee
     */
    public function setIdEmployee($idEmployee)
    {
        $this->idEmployee = $idEmployee;
    }

    /**
     * @return mixed
     */
    public function getOccupation()
    {
        return $this->occupation;
    }

    /**
     * @param mixed $occupation
     */
    public function setOccupation($occupation)
    {
        $this->occupation = $occupation;
    }

    /**
     * @return mixed
     */
    public function getCommission()
    {
        return $this->commission;
    }

    /**
     * @param mixed $commission
     */
    public function setCommission($commission)
    {
        $this->commission = $commission;
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
    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    /**
     * @return mixed
     */
    public function getEstablishmentId()
    {
        return $this->establishmentId;
    }

    /**
     * @param mixed $establishmentId
     */
    public function setEstablishmentId($establishmentId)
    {
        $this->establishmentId = $establishmentId;
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
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param mixed $created_at
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
    }

    /**
     * @return mixed
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param mixed $updated_at
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
    }

    /**
     * @return mixed
     */
    public function getBalanceId()
    {
        return $this->balanceId;
    }

    /**
     * @param mixed $balanceId
     * @return Employee
     */
    public function setBalanceId($balanceId)
    {
        $this->balanceId = $balanceId;
        return $this;
    }

}