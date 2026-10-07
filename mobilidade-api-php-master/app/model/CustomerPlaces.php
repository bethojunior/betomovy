<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/10/2018
 * Time: 09:22
 */
class CustomerPlaces extends BaseModel
{
    protected $idCustomerPlaces;
    protected $customerId;
    protected $placeId;
    protected $statusId;
    protected $created_at;
    protected $updated_at;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);

        $this->updated_at = now();
    }

    /**
     * @return mixed
     */
    public function getIdCustomerPlaces()
    {
        return $this->idCustomerPlaces;
    }

    /**
     * @param mixed $idCustomerPlaces
     * @return CustomerPlaces
     */
    public function setIdCustomerPlaces($idCustomerPlaces)
    {
        $this->idCustomerPlaces = $idCustomerPlaces;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCustomerId()
    {
        return $this->customerId;
    }

    /**
     * @param mixed $customerId
     * @return CustomerPlaces
     */
    public function setCustomerId($customerId)
    {
        $this->customerId = $customerId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPlaceId()
    {
        return $this->placeId;
    }

    /**
     * @param mixed $placeId
     * @return CustomerPlaces
     */
    public function setPlaceId($placeId)
    {
        $this->placeId = $placeId;
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
     * @return CustomerPlaces
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}