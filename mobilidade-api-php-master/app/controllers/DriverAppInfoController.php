<?php


namespace app\controllers;
use app\services\DriverAppInfoService;
use Exception;

class DriverAppInfoController extends ApiController
{
    public function actionSendDriverAppInfo()
    {
        try {
            echo $this->returnSuccess("Informações enviadas!", (new DriverAppInfoService())->insert($this->request(false)));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao enviar Informações");
        }
    }
}