<?php

namespace app\services;
use app\dao\DocUserTypeDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2020
 * Time: 09:38
 */
class DocUserTypeService
{
    /**
     * @var DocUserTypeDao
     */
    private $dao;

    public function __construct()
    {
        $this->dao = new DocUserTypeDao;
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
}