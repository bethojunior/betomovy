<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 19:18
 */
class CityConfig extends BaseModel
{
    protected $idCityConfig;
    protected $cityId;
    protected $timeToExpireTrip;
    protected $kmRemainingToPutDriverPreAvailable;
    protected $showNetValueForDriverOnCall;
    protected $quantityTripWayPoints;
    protected $cancellationCustomerFeeValue;
    protected $waitingTimeCustomerCancellationFee;
    protected $routePercentageCancellationFee;
    protected $daysToBillCancellationFee;
    protected $idealListCommonPrice;
    protected $apiKeyGoogleFront;
    protected $apiKeyGoogleBack;

    /**
     * @return mixed
     */
    public function getIdCityConfig()
    {
        return $this->idCityConfig;
    }

    /**
     * @param mixed $idCityConfig
     * @return CityConfig
     */
    public function setIdCityConfig($idCityConfig)
    {
        $this->idCityConfig = $idCityConfig;
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
     * @return CityConfig
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTimeToExpireTrip()
    {
        return $this->timeToExpireTrip;
    }

    /**
     * @param mixed $timeToExpireTrip
     * @return CityConfig
     */
    public function setTimeToExpireTrip($timeToExpireTrip)
    {
        $this->timeToExpireTrip = $timeToExpireTrip;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getShowNetValueForDriverOnCall()
    {
        return $this->showNetValueForDriverOnCall;
    }

    /**
     * @param mixed $showNetValueForDriverOnCall
     * @return CityConfig
     */
    public function setshowNetValueForDriverOnCall($showNetValueForDriverOnCall)
    {
        $this->showNetValueForDriverOnCall = $showNetValueForDriverOnCall;
        return $this;
    }

        /**
     * @return mixed
     */
    public function getKmRemainingToPutDriverPreAvailable()
    {
        return $this->kmRemainingToPutDriverPreAvailable;
    }

    /**
     * @param mixed $kmRemainingToPutDriverPreAvailable
     * @return CityConfig
     */
    public function setKmRemainingToPutDriverPreAvailable($kmRemainingToPutDriverPreAvailable)
    {
        $this->kmRemainingToPutDriverPreAvailable = $kmRemainingToPutDriverPreAvailable;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getQuantityTripWayPoints()
    {
        return $this->quantityTripWayPoints;
    }

    /**
     * @param mixed $quantityTripWayPoints
     * @return CityConfig
     */
    public function setQuantityTripWayPoints($quantityTripWayPoints)
    {
        $this->quantityTripWayPoints = $quantityTripWayPoints;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCancellationCustomerFeeValue()
    {
        return $this->cancellationCustomerFeeValue;
    }

    /**
     * @param mixed $cancellationCustomerFeeValue
     * @return CityConfig
     */
    public function setCancellationCustomerFeeValue($cancellationCustomerFeeValue)
    {
        $this->cancellationCustomerFeeValue = $cancellationCustomerFeeValue;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getWaitingTimeCustomerCancellationFee()
    {
        return $this->waitingTimeCustomerCancellationFee;
    }

    /**
     * @param mixed $waitingTimeCustomerCancellationFee
     * @return CityConfig
     */
    public function setWaitingTimeCustomerCancellationFee($waitingTimeCustomerCancellationFee)
    {
        $this->waitingTimeCustomerCancellationFee = $waitingTimeCustomerCancellationFee;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRoutePercentageCancellationFee()
    {
        return $this->routePercentageCancellationFee;
    }

    /**
     * @param mixed $routePercentageCancellationFee
     * @return CityConfig
     */
    public function setRoutePercentageCancellationFee($routePercentageCancellationFee)
    {
        $this->routePercentageCancellationFee = $routePercentageCancellationFee;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDaysToBillCancellationFee()
    {
        return $this->daysToBillCancellationFee;
    }

    /**
     * @param mixed $daysToBillCancellationFee
     * @return CityConfig
     */
    public function setDaysToBillCancellationFee($daysToBillCancellationFee)
    {
        $this->daysToBillCancellationFee = $daysToBillCancellationFee;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIdealListCommonPrice()
    {
        return $this->idealListCommonPrice;
    }

    /**
     * @param mixed $idealListCommonPrice
     * @return CityConfig
     */
    public function setIdealListCommonPrice($idealListCommonPrice)
    {
        $this->idealListCommonPrice = $idealListCommonPrice;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getApiKeyGoogleFront()
    {
        return $this->apiKeyGoogleFront;
    }

    /**
     * @param mixed $apiKeyGoogleFront
     * @return CityConfig
     */
    public function setApiKeyGoogleFront($apiKeyGoogleFront)
    {
        $this->apiKeyGoogleFront = $apiKeyGoogleFront;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getApiKeyGoogleBack()
    {
        return $this->apiKeyGoogleBack;
    }

    /**
     * @param mixed $apiKeyGoogleBack
     * @return CityConfig
     */
    public function setApiKeyGoogleBack($apiKeyGoogleBack)
    {
        $this->apiKeyGoogleBack = $apiKeyGoogleBack;
        return $this;
    }

}