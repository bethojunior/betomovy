<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/07/2019
 * Time: 15:08
 */
class RecalculatedTrip extends BaseModel
{
    protected $id;
    protected $tripReference;
    protected $oldPrice;
    protected $newPrice;
    protected $recalculatedTripTypeId;
    protected $newDistance;
    protected $newTripTime;
    protected $message;
    protected $valueDiffError;
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
     * @return RecalculatedTrip
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
     * @return RecalculatedTrip
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOldPrice()
    {
        return $this->oldPrice;
    }

    /**
     * @param mixed $oldPrice
     * @return RecalculatedTrip
     */
    public function setOldPrice($oldPrice)
    {
        $this->oldPrice = $oldPrice;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getNewPrice()
    {
        return $this->newPrice;
    }

    /**
     * @param mixed $newPrice
     * @return RecalculatedTrip
     */
    public function setNewPrice($newPrice)
    {
        $this->newPrice = $newPrice;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRecalculatedTripTypeId()
    {
        return $this->recalculatedTripTypeId;
    }

    /**
     * @param mixed $recalculatedTripTypeId
     * @return RecalculatedTrip
     */
    public function setRecalculatedTripTypeId($recalculatedTripTypeId)
    {
        $this->recalculatedTripTypeId = $recalculatedTripTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getNewDistance()
    {
        return $this->newDistance;
    }

    /**
     * @param mixed $newDistance
     * @return RecalculatedTrip
     */
    public function setNewDistance($newDistance)
    {
        $this->newDistance = $newDistance;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getNewTripTime()
    {
        return $this->newTripTime;
    }

    /**
     * @param mixed $newTripTime
     * @return RecalculatedTrip
     */
    public function setNewTripTime($newTripTime)
    {
        $this->newTripTime = $newTripTime;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param mixed $message
     * @return RecalculatedTrip
     */
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getValueDiffError()
    {
        return $this->valueDiffError;
    }

    /**
     * @param mixed $valueDiffError
     * @return RecalculatedTrip
     */
    public function setValueDiffError($valueDiffError)
    {
        $this->valueDiffError = $valueDiffError;
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
     * @return RecalculatedTrip
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return array
     */
    public function extract()
    {
        $array = get_object_vars($this);

        unset($array['table']);
        unset($array['primaryKey']);

        return $array;
    }
}