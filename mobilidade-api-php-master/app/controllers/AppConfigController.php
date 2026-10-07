<?php

namespace app\controllers;
use app\services\AppConfigService;

class AppConfigController extends ApiController
{
    public function actionFindByApp()
    {
        try {
            echo $this->returnSuccess("Busca de configuração por app",
                (new AppConfigService())->findByApp($this->request(false)->appId));
        } catch (\Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configuração por app");
        }
    }
}