<?php

namespace app\services;

use app\dao\RequiredFieldDao;
use app\exceptions\RequiredFieldException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/08/2019
 * Time: 10:49
 */
class RequiredFieldService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new RequiredFieldDao;
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws RequiredFieldException
     */
    public function find($request)
    {
        if (!isset($request->userTypeId))
            throw new RequiredFieldException(1610);

        $fields = $this->dao
            ->findByUserType(
                $request->userTypeId,
                (isset($request->fullFields) && $request->fullFields == 1));

        return array_map(function ($field) {
            $field->compelField = (boolean)$field->compelField;
            $field->required = (boolean)$field->required;

            return $field;
        }, $fields);
    }
}