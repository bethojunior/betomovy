<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 17:49
 */
class TripDiscountCoupon extends BaseModel
{
    protected $id;
    protected $tripReference;
    protected $userDiscountCouponId;
    protected $oldPrice;
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
     * @return TripDiscountCoupon
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
     * @return TripDiscountCoupon
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserDiscountCouponId()
    {
        return $this->userDiscountCouponId;
    }

    /**
     * @param mixed $userDiscountCouponId
     * @return TripDiscountCoupon
     */
    public function setUserDiscountCouponId($userDiscountCouponId)
    {
        $this->userDiscountCouponId = $userDiscountCouponId;
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
     * @return TripDiscountCoupon
     */
    public function setOldPrice($oldPrice)
    {
        $this->oldPrice = $oldPrice;
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
     * @return TripDiscountCoupon
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

}