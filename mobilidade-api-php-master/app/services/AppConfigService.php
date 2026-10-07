<?php

namespace app\services;
use app\dao\AppConfigDao;

class AppConfigService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new AppConfigDao;
    }

    public function findByApp($appId)
    {
        $result = $this->dao->findByApp($appId);

        return !is_array($result) ? $result : null;
    }
}