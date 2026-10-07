<?php


namespace app\controllers;
use app\services\QueueFinishedTripService;
use Exception;

class QueueFinishedTripController extends ApiController
{
    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess(
                "Viagens encontrada com sucesso",
                (new QueueFinishedTripService())->getAll()
            );
        } catch (Exception $exception) {
            echo $this->returnError($exception, "Erro ao buscar viagens");
        }
    }
}