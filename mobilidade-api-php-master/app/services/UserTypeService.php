<?php

namespace app\services;
use app\dao\UserTypeDao;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 26/08/2019
 * Time: 12:04
 */
class UserTypeService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new UserTypeDao;
    }

    public function getTypeDrivers()
    {
        return $this->dao->getTypeDrivers();
    }

    public function getDriversByAppPartner($keyAppPartner)
    {
        return $this->dao->getDriversByAppPartner($keyAppPartner);
    }

    public function getMessageTripCanceled($tripReference)
    {
        return $this->dao->getMessageTripCanceled($tripReference);
    }
}