<?php

namespace app\services;
use app\dao\PreRegisterDriverMkDao;
use app\model\PreRegisterDriverMk;
use app\model\UserType;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/01/2019
 * Time: 14:17
 */
class PreRegisterDriverMkService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new PreRegisterDriverMkDao;
    }

    public function insertDriver($request): PreRegisterDriverMk
    {
        $preRegisterDriver = new PreRegisterDriverMk($request);
        $preRegisterDriver
            ->setUserTypeId($request->userTypeId ?? UserType::MOTORISTA_PARTICULAR)
            ->setId($this->dao
                ->sqlInsert($preRegisterDriver));

        return $preRegisterDriver;
    }

    public function getListDriver()
    {
        return $this->dao->getAll();
    }
}