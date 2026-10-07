<?php

namespace app\controllers;
use app\services\TripRouteTracingService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/11/2019
 * Time: 17:52
 */
class TripRouteTracingController extends ApiController
{
    public function actionFindByTrip()
    {
        try {
            echo $this->returnSuccess(
                "Rota encontrada",
                (new TripRouteTracingService)->findByTrip($this->requestQuery()));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar rota da viagem");
        }
    }
}