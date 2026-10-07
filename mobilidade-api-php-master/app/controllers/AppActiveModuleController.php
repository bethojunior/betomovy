<?php

namespace app\controllers;


use app\services\AppActiveModuleService;
use Exception;

class AppActiveModuleController extends ApiController
{
    public function actionGetAllActiveModules()
    {
        try {
            echo $this->returnSuccess("Módulos ativos do aplicativo encontrados",
                (new AppActiveModuleService())
                    ->findAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os módulos ativos do aplicativo");
        }
    }
}