<?php

namespace app\controllers;
use app\services\KnobTripService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/02/2019
 * Time: 11:03
 */
class KnobTripController extends ApiController
{
    public function actionInit()
    {
        try {
            echo $this->returnSuccess("Viagem de maçaneta iniciada",
                (new KnobTripService)
                    ->init($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir viagem");
        }
    }
}