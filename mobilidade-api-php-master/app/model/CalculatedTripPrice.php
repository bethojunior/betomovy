<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/05/2019
 * Time: 08:26
 */
class CalculatedTripPrice extends BaseModel
{
    protected $id;
    protected $priceId;
    protected $userId;
    protected $price;
    protected $multiplierValue;
    protected $competitivePrice;
    protected $tripTypeId;
    protected $originLatitude;
    protected $originLongitude;
    protected $destinationLatitude;
    protected $destinationLongitude;
    protected $originAddress;
    protected $destinationAddress;
    protected $created_at;

    protected $primaryKey = 'id';

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);
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
     * @return CalculatedTripPrice
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPriceId()
    {
        return $this->priceId;
    }

    /**
     * @param mixed $priceId
     * @return CalculatedTripPrice
     */
    public function setPriceId($priceId)
    {
        $this->priceId = $priceId;
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
     * @return CalculatedTripPrice
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @param mixed $price
     * @return CalculatedTripPrice
     */
    public function setPrice($price)
    {
        $this->price = $price;
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
     * @return CalculatedTripPrice
     */
    public function setMultiplierValue($multiplierValue)
    {
        $this->multiplierValue = $multiplierValue;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCompetitivePrice()
    {
        return $this->competitivePrice;
    }

    /**
     * @param mixed $competitivePrice
     * @return CalculatedTripPrice
     */
    public function setCompetitivePrice($competitivePrice)
    {
        $this->competitivePrice = $competitivePrice;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripTypeId()
    {
        return $this->tripTypeId;
    }

    /**
     * @param mixed $tripTypeId
     * @return CalculatedTripPrice
     */
    public function setTripTypeId($tripTypeId)
    {
        $this->tripTypeId = $tripTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOriginLatitude()
    {
        return $this->originLatitude;
    }

    /**
     * @param mixed $originLatitude
     * @return CalculatedTripPrice
     */
    public function setOriginLatitude($originLatitude)
    {
        $this->originLatitude = $originLatitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOriginLongitude()
    {
        return $this->originLongitude;
    }

    /**
     * @param mixed $originLongitude
     * @return CalculatedTripPrice
     */
    public function setOriginLongitude($originLongitude)
    {
        $this->originLongitude = $originLongitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDestinationLatitude()
    {
        return $this->destinationLatitude;
    }

    /**
     * @param mixed $destinationLatitude
     * @return CalculatedTripPrice
     */
    public function setDestinationLatitude($destinationLatitude)
    {
        $this->destinationLatitude = $destinationLatitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDestinationLongitude()
    {
        return $this->destinationLongitude;
    }

    /**
     * @param mixed $destinationLongitude
     * @return CalculatedTripPrice
     */
    public function setDestinationLongitude($destinationLongitude)
    {
        $this->destinationLongitude = $destinationLongitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOriginAddress()
    {
        return $this->originAddress;
    }

    /**
     * @param mixed $originAddress
     * @return CalculatedTripPrice
     */
    public function setOriginAddress($originAddress)
    {
        $this->originAddress = $originAddress;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDestinationAddress()
    {
        return $this->destinationAddress;
    }

    /**
     * @param mixed $destinationAddress
     * @return CalculatedTripPrice
     */
    public function setDestinationAddress($destinationAddress)
    {
        $this->destinationAddress = $destinationAddress;
        return $this;
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
     * @return CalculatedTripPrice
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

}