<?php

namespace app\model;

use app\utils\BaseModel;

class TripPixPayments extends BaseModel
{
    protected $id;
    protected $tripReference;
    protected $idTransaction;
    protected $created_at;

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
     * @return TripPixPayments
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
     * @return TripPixPayments
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIdTransaction()
    {
        return $this->idTransaction;
    }

    /**
     * @param mixed $idTransaction
     * @return TripPixPayments
     */
    public function setIdTransaction($idTransaction)
    {
        $this->idTransaction = $idTransaction;
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
     * @return TripPixPayments
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }
}