<?php

namespace app\services;

use app\dao\UserTypeLinkedAppPartnerDao;

class UserTypeLinkedAppPartnerService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new UserTypeLinkedAppPartnerDao;
    }

    public function getUsersTypeLinked()
    {
        $responseUsersTypeLinked = $this->dao
            ->getAllUserTypeLinkedAppPartner();

        return $responseUsersTypeLinked;
    }
}