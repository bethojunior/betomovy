<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/10/2018
 * Time: 09:18
 */
class Place extends BaseModel
{
    protected $idPlace;
    protected $alias;
    protected $address;
    protected $number;
    protected $zipcode;
    protected $neighborhood;
    protected $cityId;
    protected $estateId;
    protected $latitude;
    protected $longitude;
    protected $complement;
    protected $referencePoint;
    protected $deliveryNeighborhoodId;
    protected $statusId;
    protected $created_at;
    protected $updated_at;

    protected $table = 'places';

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        $this->updated_at = $obj->updated_at ?? now();

        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdPlace()
    {
        return $this->idPlace;
    }

    /**
     * @param mixed $idPlace
     * @return Place
     */
    public function setIdPlace($idPlace)
    {
        $this->idPlace = $idPlace;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAlias()
    {
        return $this->alias;
    }

    /**
     * @param mixed $alias
     * @return Place
     */
    public function setAlias($alias)
    {
        $this->alias = $alias;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * @param mixed $address
     * @return Place
     */
    public function setAddress($address)
    {
        $this->address = $address;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * @param mixed $number
     * @return Place
     */
    public function setNumber($number)
    {
        $this->number = $number;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getZipcode()
    {
        return $this->zipcode;
    }

    /**
     * @param mixed $zipcode
     * @return Place
     */
    public function setZipcode($zipcode)
    {
        $this->zipcode = $zipcode;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getNeighborhood()
    {
        return $this->neighborhood;
    }

    /**
     * @param mixed $neighborhood
     * @return Place
     */
    public function setNeighborhood($neighborhood)
    {
        $this->neighborhood = $neighborhood;
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
     * @return Place
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEstateId()
    {
        return $this->estateId;
    }

    /**
     * @param mixed $estateId
     * @return Place
     */
    public function setEstateId($estateId)
    {
        $this->estateId = $estateId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLatitude()
    {
        return $this->latitude;
    }

    /**
     * @param mixed $latitude
     * @return Place
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLongitude()
    {
        return $this->longitude;
    }

    /**
     * @param mixed $longitude
     * @return Place
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getComplement()
    {
        return $this->complement;
    }

    /**
     * @param mixed $complement
     * @return Place
     */
    public function setComplement($complement)
    {
        $this->complement = $complement;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getReferencePoint()
    {
        return $this->referencePoint;
    }

    /**
     * @param mixed $referencePoint
     * @return Place
     */
    public function setReferencePoint($referencePoint)
    {
        $this->referencePoint = $referencePoint;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDeliveryNeighborhoodId()
    {
        return $this->deliveryNeighborhoodId;
    }

    /**
     * @param mixed $deliveryNeighborhoodId
     * @return Place
     */
    public function setDeliveryNeighborhoodId($deliveryNeighborhoodId)
    {
        $this->deliveryNeighborhoodId = $deliveryNeighborhoodId;
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
     * @return Place
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
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
     * @return Place
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
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
     * @return Place
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

}