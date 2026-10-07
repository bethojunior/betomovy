<?php

namespace app\services;

use app\dao\AppActiveModuleDao;

class AppActiveModuleService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new AppActiveModuleDao;
    }

    public function findAll()
    {
        return $this->dao->getAll();
    }

    public function findManyByModuleName(array $moduleNames)
    {
        return $this->dao->findManyByModuleName($moduleNames);
    }

}