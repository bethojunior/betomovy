<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/02/2019
 * Time: 10:41
 */
class RewardTrip extends BaseModel
{
    protected $id;
    protected $value;
    protected $rewardTripTypeId;
    protected $tripReference;
    protected $driverId;
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
     * @return RewardTrip
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param mixed $value
     * @return RewardTrip
     */
    public function setValue($value)
    {
        $this->value = $value;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRewardTripTypeId()
    {
        return $this->rewardTripTypeId;
    }

    /**
     * @param mixed $rewardTripTypeId
     * @return RewardTrip
     */
    public function setRewardTripTypeId($rewardTripTypeId)
    {
        $this->rewardTripTypeId = $rewardTripTypeId;
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
     * @return RewardTrip
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverId()
    {
        return $this->driverId;
    }

    /**
     * @param mixed $driverId
     * @return RewardTrip
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
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
     * @return RewardTrip
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

}