<?php

namespace app\services;
use app\dao\MilitaryForceDao;
use app\dao\MilitaryForceGraduationDao;
use app\dao\MilitaryStatusDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/12/2019
 * Time: 11:34
 */
class MilitaryForceService
{
    private $dao;
    private $militaryForceGraduationDao;
    private $militaryStatusDao;

    public function __construct()
    {
        $this->dao = new MilitaryForceDao;
        $this->militaryForceGraduationDao = new MilitaryForceGraduationDao;
        $this->militaryStatusDao = new MilitaryStatusDao;
    }

    public function findAll()
    {
        return $this->dao
            ->findAll();
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function findGraduations($request)
    {
        if (!isset($request->militaryForceId))
            throw new Exception("Força militar não identificada");

        $result = $this->militaryForceGraduationDao
            ->findByMilitaryForce($request->militaryForceId);

        return $result;
    }

    public function findAllStatus()
    {
        return $this->militaryStatusDao
            ->getAll();
    }
}