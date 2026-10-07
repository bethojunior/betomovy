<?php

namespace app\controllers;

use app\services\DriverRideService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/12/2019
 * Time: 12:05
 */
class DriverRideController extends ApiController
{
    public function actionOffered()
    {
        try {
            $result = (new DriverRideService)
                ->findOffered(Headers::getUserId());

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar caronas ofertadas pelo motorista");
        }
    }
}