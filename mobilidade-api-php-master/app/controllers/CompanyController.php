<?php

namespace app\controllers;
use app\services\CompanyService;
use app\services\RegisterCompanyService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/07/2019
 * Time: 17:21
 */
class CompanyController extends ApiController
{
    public function actionRegister()
    {
        try {
            echo $this->returnSuccess("Empresa registrada com sucesso",
                (new RegisterCompanyService)
                    ->register($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao cadastrar empresa");
        }
    }

    public function actionFieldCheck()
    {
        try {
            echo $this->returnSuccess("Campo permitido",
                (new CompanyService)->fieldCheck($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro na verificação do campo");
        }
    }
}