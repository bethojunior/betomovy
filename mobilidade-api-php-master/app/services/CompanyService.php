<?php

namespace app\services;

use app\dao\CompanyDao;
use app\utils\FormatValue;
use app\validator\CompanyValidator;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/07/2019
 * Time: 10:33
 */
class CompanyService
{
    private $dao;
    private $validator;

    public function __construct()
    {
        $this->dao = new CompanyDao;
        $this->validator = new CompanyValidator;
    }

    /**
     * @param $requestQuery
     * @return bool
     * @throws Exception
     */
    public function fieldCheck($requestQuery)
    {
        $this->validator->validateCheckField($requestQuery);

        $dataExists = $this->dao
            ->findByField($requestQuery->field, FormatValue::onlySimpleCharacters($requestQuery->value));

        if ($dataExists)
            throw new Exception("Esse " . $requestQuery->field . " já está sendo utilizado");

        return true;
    }
}