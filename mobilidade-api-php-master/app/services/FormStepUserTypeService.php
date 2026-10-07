<?php

namespace app\services;
use app\dao\FormStepUserTypeDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/01/2020
 * Time: 16:30
 */
class FormStepUserTypeService
{
    /**
     * @var FormStepUserTypeDao
     */
    private $dao;

    public function __construct()
    {
        $this->dao = new FormStepUserTypeDao;
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function findByUserType($request)
    {
        if (!isset($request->userTypeId))
            throw new Exception("Tipo de usuário não informado");

        return $this->dao
            ->findByUserType($request->userTypeId);
    }

    public function findByUserTypeId($userTypeId)
    {
        if (!$userTypeId)
            throw new Exception("Tipo de usuário não informado");

        return $this->dao
            ->findByUserType($userTypeId);
    }
}