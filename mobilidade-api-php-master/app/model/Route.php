<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 20:39
 */
class Route extends BaseModel
{
    protected $id;
    protected $name;
    protected $price;
    protected $priceId;
    protected $cityId;
    protected $tripTypeId;
    protected $originId;
    protected $destinationId;
    protected $estimatedTime;
    protected $estimatedDistance;
    protected $allowCustomerStops;
    protected $statusId;
    protected $active;
    protected $created_at;
    protected $updated_at;
    protected $defaultLayout;

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
     * @return Route
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     * @return Route
     */
    public function setName($name)
    {
        $this->name = $name;
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
     * @return Route
     */
    public function setPrice($price)
    {
        $this->price = $price;
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
     * @return Route
     */
    public function setPriceId($priceId)
    {
        $this->priceId = $priceId;
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
     * @return Route
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
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
     * @return Route
     */
    public function setTripTypeId($tripTypeId)
    {
        $this->tripTypeId = $tripTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOriginId()
    {
        return $this->originId;
    }

    /**
     * @param mixed $originId
     * @return Route
     */
    public function setOriginId($originId)
    {
        $this->originId = $originId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDestinationId()
    {
        return $this->destinationId;
    }

    /**
     * @param mixed $destinationId
     * @return Route
     */
    public function setDestinationId($destinationId)
    {
        $this->destinationId = $destinationId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEstimatedTime()
    {
        return $this->estimatedTime;
    }

    /**
     * @param mixed $estimatedTime
     * @return Route
     */
    public function setEstimatedTime($estimatedTime)
    {
        $this->estimatedTime = $estimatedTime;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEstimatedDistance()
    {
        return $this->estimatedDistance;
    }

    /**
     * @param mixed $estimatedDistance
     * @return Route
     */
    public function setEstimatedDistance($estimatedDistance)
    {
        $this->estimatedDistance = $estimatedDistance;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAllowCustomerStops()
    {
        return $this->allowCustomerStops;
    }

    /**
     * @param mixed $allowCustomerStops
     * @return Route
     */
    public function setAllowCustomerStops($allowCustomerStops)
    {
        $this->allowCustomerStops = $allowCustomerStops;
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
     * @return Route
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * @param mixed $active
     * @return Route
     */
    public function setActive($active)
    {
        $this->active = $active;
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
     * @return Route
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
     * @return Route
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDefaultLayout()
    {
        return $this->defaultLayout;
    }

    /**
     * @param mixed $defaultLayout
     * @return Route
     */
    public function setDefaultLayout($defaultLayout)
    {
        $this->defaultLayout = $defaultLayout;
        return $this;
    }

}