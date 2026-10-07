<?php

namespace app\services;

use app\dao\ConfigAppPartnerDao;

class ConfigAppPartnerService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new ConfigAppPartnerDao;
    }

    public function getAppPartner($key)
    {
        $responseConfigAppPartner = $this->dao
            ->getConfigAppPartners($key);

        return $responseConfigAppPartner;
    }

    public function findByKey($key)
    {
        return $this->dao->findByKey($key);
    }
}