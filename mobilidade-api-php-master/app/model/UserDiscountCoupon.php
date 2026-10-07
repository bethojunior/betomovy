<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 13:34
 */
class UserDiscountCoupon extends BaseModel
{
    protected $id;
    protected $discountCouponId;
    protected $userId;
    protected $used;
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
     * @return UserDiscountCoupon
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDiscountCouponId()
    {
        return $this->discountCouponId;
    }

    /**
     * @param mixed $discountCouponId
     * @return UserDiscountCoupon
     */
    public function setDiscountCouponId($discountCouponId)
    {
        $this->discountCouponId = $discountCouponId;
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
     * @return UserDiscountCoupon
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUsed()
    {
        return $this->used;
    }

    /**
     * @param mixed $used
     * @return UserDiscountCoupon
     */
    public function setUsed($used)
    {
        $this->used = $used;
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
     * @return UserDiscountCoupon
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

}