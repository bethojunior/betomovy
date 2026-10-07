<?php

namespace app\controllers;
use app\dao\EmployeeDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/10/2018
 * Time: 19:58
 */
class EmployeeController extends ApiController
{
    public function actionRegister()
    {
        $request = $this->postRequest('stdObject');

        try {
            (new EmployeeDao)->register($request);
            echo $this->returnSuccess("Cadastro realizado com sucesso!", true);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}