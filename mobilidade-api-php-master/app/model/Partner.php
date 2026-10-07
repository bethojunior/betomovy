<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 07/05/2019
 * Time: 17:43
 */
class Partner extends BaseModel
{
    protected $idPartner;
    protected $userId;
    protected $nameEstablishment;
    protected $addressEstablishment;
    protected $latitude;
    protected $longitude;
    protected $statusId;
    protected $created_at;
    protected $function;
    protected $partnerRegisterStatusId;
    protected $managerId;
    protected $api_token;

    /**
     * @return mixed
     */
    public function getIdPartner()
    {
        return $this->idPartner;
    }

    /**
     * @param mixed $idPartner
     * @return Partner
     */
    public function setIdPartner($idPartner)
    {
        $this->idPartner = $idPartner;
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
     * @return Partner
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getNameEstablishment()
    {
        return $this->nameEstablishment;
    }

    /**
     * @param mixed $nameEstablishment
     * @return Partner
     */
    public function setNameEstablishment($nameEstablishment)
    {
        $this->nameEstablishment = $nameEstablishment;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAddressEstablishment()
    {
        return $this->addressEstablishment;
    }

    /**
     * @param mixed $addressEstablishment
     * @return Partner
     */
    public function setAddressEstablishment($addressEstablishment)
    {
        $this->addressEstablishment = $addressEstablishment;
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
     * @return Partner
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
     * @return Partner
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;
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
     * @return Partner
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
     * @param mixed $create_at
     * @return Partner
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFunction()
    {
        return $this->function;
    }

    /**
     * @param $function
     * @return $this
     */
    public function setFunction($function)
    {
        $this->function = $function;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getManagerId()
    {
        return $this->managerId;
    }

    /**
     * @param mixed $managerId
     * @return Partner
     */
    public function setManagerId($managerId)
    {
        $this->managerId = $managerId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPartnerRegisterStatusId()
    {
        return $this->partnerRegisterStatusId;
    }

    /**
     * @param mixed $partnerRegisterStatusId
     * @return Partner
     */
    public function setPartnerRegisterStatusId($partnerRegisterStatusId)
    {
        $this->partnerRegisterStatusId = $partnerRegisterStatusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getApiToken()
    {
        return $this->api_token;
    }

    /**
     * @param mixed $api_token
     * @return Partner
     */
    public function setApiToken($api_token)
    {
        $this->api_token = $api_token;
        return $this;
    }

}