<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 14:16
 */
class PriceDynamic extends BaseModel
{
    protected $idPriceDynamic;
    protected $dayOfWeek;
    protected $cityId;
    protected $multiplierValue;
    protected $activatedManual;
    protected $statusId;

    /**
     * @return mixed
     */
    public function getIdPriceDynamic()
    {
        return $this->idPriceDynamic;
    }

    /**
     * @param mixed $idPriceDynamic
     * @return PriceDynamic
     */
    public function setIdPriceDynamic($idPriceDynamic)
    {
        $this->idPriceDynamic = $idPriceDynamic;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDayOfWeek()
    {
        return $this->dayOfWeek;
    }

    /**
     * @param mixed $dayOfWeek
     * @return PriceDynamic
     */
    public function setDayOfWeek($dayOfWeek)
    {
        $this->dayOfWeek = $dayOfWeek;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCityId()
    {
        return $this->cityId;
    }

    /**
     * @param mixed $cityId
     * @return PriceDynamic
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMultiplierValue()
    {
        return $this->multiplierValue;
    }

    /**
     * @param mixed $multiplierValue
     * @return PriceDynamic
     */
    public function setMultiplierValue($multiplierValue)
    {
        $this->multiplierValue = $multiplierValue;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getActivatedManual()
    {
        return $this->activatedManual;
    }

    /**
     * @param mixed $activatedManual
     * @return PriceDynamic
     */
    public function setActivatedManual($activatedManual)
    {
        $this->activatedManual = $activatedManual;
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
     * @return PriceDynamic
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}