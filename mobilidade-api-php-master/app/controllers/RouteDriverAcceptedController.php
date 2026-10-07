<?php

namespace app\controllers;

use app\services\RouteDriverAcceptService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 19:08
 */
class RouteDriverAcceptedController extends ApiController
{
    public function actionGet()
    {
        try {
            $result = (new RouteDriverAcceptService)
                ->findByUser(Headers::getUserId(), $this->requestQuery());

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar rotas solicitadas pelo motorista");
        }
    }
}