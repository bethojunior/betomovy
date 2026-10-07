<?php


namespace app\services;
use app\dao\DriverAppInfoDao;
use app\validator\DriverAppInfoValidator;

class DriverAppInfoService
{
    private $validator;
    private $dao;

    public function __construct()
    {
        $this->validator = new DriverAppInfoValidator();
        $this->dao = new DriverAppInfoDao();
    }

    public function insert($request)
    {
        $this->validator->validateInsert($request);
        return $this->dao->insert($request);
    }
}