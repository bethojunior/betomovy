<?php


namespace app\model;

use app\utils\BaseModel;

class FreightInfo extends BaseModel
{

    protected $id;
    protected $tripReference;
    protected $collectionFloor;
    protected $deliveryFloor;
    protected $isNearCollection;
    protected $isNearDelivery;

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
     * @return FreightInfo
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
     * @return FreightInfo
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCollectionFloor()
    {
        return $this->collectionFloor;
    }

    /**
     * @param mixed $collectionFloor
     * @return FreightInfo
     */
    public function setCollectionFloor($collectionFloor)
    {
        $this->collectionFloor = $collectionFloor;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDeliveryFloor()
    {
        return $this->deliveryFloor;
    }

    /**
     * @param mixed $deliveryFloor
     * @return FreightInfo
     */
    public function setDeliveryFloor($deliveryFloor)
    {
        $this->deliveryFloor = $deliveryFloor;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIsNearCollection()
    {
        return $this->isNearCollection;
    }

    /**
     * @param mixed $isNearCollection
     * @return FreightInfo
     */
    public function setIsNearCollection($isNearCollection)
    {
        $this->isNearCollection = $isNearCollection;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIsNearDelivery()
    {
        return $this->isNearDelivery;
    }

    /**
     * @param mixed $isNearDelivery
     * @return FreightInfo
     */
    public function setIsNearDelivery($isNearDelivery)
    {
        $this->isNearDelivery = $isNearDelivery;
        return $this;
    }


}