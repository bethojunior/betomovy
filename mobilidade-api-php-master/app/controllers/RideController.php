<?php

namespace app\controllers;

use app\services\CancelRideService;
use app\services\NewRideService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 20:05
 */
class RideController extends ApiController
{
    public function actionNew()
    {
        try {
            $result = (new NewRideService)
                ->new($this->request(false), Headers::getUserId());

            echo $this->returnSuccess("Carona ofertada com sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao solicitar carona");
        }
    }

    public function actionCancel()
    {
        try {
            $result = (new CancelRideService)
                ->byDriver($this->request(false));

            echo $this->returnSuccess("Carona cancelada com sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao cancelar carona");
        }
    }
}