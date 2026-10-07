<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/05/2019
 * Time: 09:21
 */
class PriceComparision extends BaseModel
{
    protected $id;
    protected $price_return;
    protected $price_uber;
    protected $origin_address;
    protected $destination_address;
    protected $origin_latitude;
    protected $origin_longitude;
    protected $destination_latitude;
    protected $destination_longitude;

    protected $primaryKey = 'id';

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return PriceComparision
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPriceReturn()
    {
        return $this->price_return;
    }

    /**
     * @param mixed $price_return
     * @return PriceComparision
     */
    public function setPriceReturn($price_return)
    {
        $this->price_return = $price_return;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPriceUber()
    {
        return $this->price_uber;
    }

    /**
     * @param mixed $price_uber
     * @return PriceComparision
     */
    public function setPriceUber($price_uber)
    {
        $this->price_uber = $price_uber;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOriginAddress()
    {
        return $this->origin_address;
    }

    /**
     * @param mixed $origin_address
     * @return PriceComparision
     */
    public function setOriginAddress($origin_address)
    {
        $this->origin_address = $origin_address;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDestinationAddress()
    {
        return $this->destination_address;
    }

    /**
     * @param mixed $destination_address
     * @return PriceComparision
     */
    public function setDestinationAddress($destination_address)
    {
        $this->destination_address = $destination_address;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOriginLatitude()
    {
        return $this->origin_latitude;
    }

    /**
     * @param mixed $origin_latitude
     * @return PriceComparision
     */
    public function setOriginLatitude($origin_latitude)
    {
        $this->origin_latitude = $origin_latitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOriginLongitude()
    {
        return $this->origin_longitude;
    }

    /**
     * @param mixed $origin_longitude
     * @return PriceComparision
     */
    public function setOriginLongitude($origin_longitude)
    {
        $this->origin_longitude = $origin_longitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDestinationLatitude()
    {
        return $this->destination_latitude;
    }

    /**
     * @param mixed $destination_latitude
     * @return PriceComparision
     */
    public function setDestinationLatitude($destination_latitude)
    {
        $this->destination_latitude = $destination_latitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDestinationLongitude()
    {
        return $this->destination_longitude;
    }

    /**
     * @param mixed $destination_longitude
     * @return PriceComparision
     */
    public function setDestinationLongitude($destination_longitude)
    {
        $this->destination_longitude = $destination_longitude;
        return $this;
    }

}