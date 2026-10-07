<?php

namespace app\controllers;

use app\services\RouteService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/12/2019
 * Time: 09:36
 */
class RouteController extends ApiController
{
    public function actionGet()
    {
        try {
            $result = (new RouteService)
                ->find($this->requestQuery());

            echo $this->returnSuccess("Rotas disponíveis encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar as rotas disponiveis");
        }
    }

    public function actionUse()
    {
        try {
            $result = (new RouteService)
                ->requestUse($this->request(false), Headers::getUserId());

            echo $this->returnSuccess(
                "Uso da rota solicitada com sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao solicitar uso da rota");
        }
    }
}