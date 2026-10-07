<?php

namespace app\controllers;

use app\services\UserIndicationService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/10/2019
 * Time: 17:38
 */
class UserIndicationController extends ApiController
{
    public function actionGetIndicated()
    {
        try {
            echo $this->returnSuccess(
                "Listando usuáarios indicados",
                (new UserIndicationService)
                    ->getIndicated(Headers::getUserId(), $this->requestQuery()));
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao listar usuários indicados');
        }
    }
}