<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 24/07/2018
 * Time: 08:42
 */
class Customer extends BaseModel
{
    protected $idCustomer;
    protected $name;
    protected $phone;
    protected $userId;
    protected $balanceId;
    protected $placeId;
    protected $profileImage;
    protected $customerRegisterStatusId;

    /**
     * @return mixed
     */
    public function getIdCustomer()
    {
        return $this->idCustomer;
    }

    /**
     * @param mixed $idCustomer
     */
    public function setIdCustomer($idCustomer): void
    {
        $this->idCustomer = $idCustomer;
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
     */
    public function setName($name): void
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * @param mixed $phone
     */
    public function setPhone($phone): void
    {
        $this->phone = $phone;
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
     * @return Customer
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBalanceId()
    {
        return $this->balanceId;
    }

    /**
     * @param mixed $balanceId
     * @return Customer
     */
    public function setBalanceId($balanceId)
    {
        $this->balanceId = $balanceId;
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
     * @return Customer
     */
    public function setPlaceId($placeId)
    {
        $this->placeId = $placeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getProfileImage()
    {
        return $this->profileImage;
    }

    /**
     * @param mixed $profileImage
     * @return Customer
     */
    public function setProfileImage($profileImage)
    {
        $this->profileImage = $profileImage;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCustomerRegisterStatusId()
    {
        return $this->customerRegisterStatusId;
    }

    /**
     * @param mixed $customerRegisterStatusId
     * @return Customer
     */
    public function setCustomerRegisterStatusId($customerRegisterStatusId)
    {
        $this->customerRegisterStatusId = $customerRegisterStatusId;
        return $this;
    }

}