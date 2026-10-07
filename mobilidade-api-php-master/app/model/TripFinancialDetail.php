<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/11/2018
 * Time: 10:38
 */
class TripFinancialDetail extends BaseModel
{
    protected $idTripFinancialDetail;
    protected $tripReference;
    protected $appCommission;
    protected $driverCommission;
    protected $partnerCommission;

    protected $table = "tripFinancialDetail";

    /**
     * @return mixed
     */
    public function getIdTripFinancialDetail()
    {
        return $this->idTripFinancialDetail;
    }

    /**
     * @param mixed $idTripFinancialDetail
     * @return TripFinancialDetail
     */
    public function setIdTripFinancialDetail($idTripFinancialDetail)
    {
        $this->idTripFinancialDetail = $idTripFinancialDetail;
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
     * @return TripFinancialDetail
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAppCommission()
    {
        return $this->appCommission;
    }

    /**
     * @param mixed $appCommission
     * @return TripFinancialDetail
     */
    public function setAppCommission($appCommission)
    {
        $this->appCommission = $appCommission;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverCommission()
    {
        return $this->driverCommission;
    }

    /**
     * @param mixed $driverCommission
     * @return TripFinancialDetail
     */
    public function setDriverCommission($driverCommission)
    {
        $this->driverCommission = $driverCommission;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPartnerCommission()
    {
        return $this->partnerCommission;
    }

    /**
     * @param mixed $partnerCommission
     * @return TripFinancialDetail
     */
    public function setPartnerCommission($partnerCommission)
    {
        $this->partnerCommission = $partnerCommission;
        return $this;
    }

}