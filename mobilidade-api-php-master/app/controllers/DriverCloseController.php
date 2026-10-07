<?php

namespace app\controllers;

use app\services\DriverCloseService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/11/2019
 * Time: 11:51
 */
class DriverCloseController extends ApiController
{
    public function actionGet()
    {
        try {
            echo $this->returnSuccess(
                "Motoristas próximos encontrados",
                (new DriverCloseService)->findClose($this->requestQuery(), Headers::getUserId())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}