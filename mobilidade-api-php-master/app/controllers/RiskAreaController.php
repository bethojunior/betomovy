<?php

namespace app\controllers;
use app\services\RiskAreaService;
use Exception;

class RiskAreaController extends ApiController
{
    public function actionStore()
    {
        try {
            echo $this->returnSuccess("Área de risca criada com sucesso", (new RiskAreaService)->store($this->request(false)));
        } catch (Exception $exception) {
            echo $this->returnError($exception);
        }
    }
}