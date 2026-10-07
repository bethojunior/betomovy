<?php

namespace app\controllers;
use app\services\AdvertisingService;

use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/10/2019
 * Time: 10:20
 */
class AdvertisingController extends ApiController
{
    public function actionGet()
    {
        try {
            echo $this->returnSuccess(
                "Publicidade encontrada com sucesso",
                (new AdvertisingService)->findByCoordinate($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar publicidade");
        }
    }

    public function actionList()
    {
        try {
            echo $this->returnSuccess(
                "Publicidade encontrada com sucesso",
                (new AdvertisingService)->findAllByCoordinate($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar publicidade");
        }
    }
}