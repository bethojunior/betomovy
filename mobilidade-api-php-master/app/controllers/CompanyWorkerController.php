<?php

namespace app\controllers;
use app\services\CompanyWorkerService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/07/2019
 * Time: 11:41
 */
class CompanyWorkerController extends ApiController
{
    public function actionFieldCheck()
    {
        try {
            echo $this->returnSuccess("Campo permitido",
                (new CompanyWorkerService)->fieldCheck($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro na verificação do campo");
        }
    }
}