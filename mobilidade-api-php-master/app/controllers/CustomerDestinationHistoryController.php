<?php

namespace app\controllers;
use app\services\CustomerDestinationHistoryService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/01/2019
 * Time: 15:17
 */
class CustomerDestinationHistoryController extends ApiController
{
    public function actionGet()
    {
        try {
            echo $this->returnSuccess("Histórico de destinos encontrados",
                (new CustomerDestinationHistoryService)
                    ->getHistorical()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar o histórico de destinos");
        }
    }
}