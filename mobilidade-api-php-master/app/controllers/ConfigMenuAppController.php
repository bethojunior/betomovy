<?php

namespace app\controllers;

use app\services\ConfigMenuAppService;
use Exception;

class ConfigMenuAppController extends ApiController
{
    public function actionSearch()
    {
        try {
            $result = (new ConfigMenuAppService)
                ->menuPermissions();

            echo $this->returnSuccess("Permissões encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar as permissões");
        }
    }
}