<?php

namespace app\controllers;

use app\services\DriverFormOfPaymentService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/07/2020
 * Time: 10:36
 */
class DriverFormOfPaymentController extends ApiController
{
    public function actionInsert()
    {
        try {
            $result = (new DriverFormOfPaymentService)
                ->insert($this->request(false), Headers::getUserId());

            echo $this->returnSuccess("Forma(s) de pagamento inserida(s)", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetAll()
    {
        try {
            $result = (new DriverFormOfPaymentService)
                ->findAll(Headers::getUserId());

            echo $this->returnSuccess("Formas de pagamento encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDelete()
    {
        try {
            $result = (new DriverFormOfPaymentService)
                ->delete($this->request(false));

            echo $this->returnSuccess("Forma(s) de pagamento inserida(s)", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetAllImposition()
    {
        try {
            $result = (new DriverFormOfPaymentService)
                ->findAllImposition(Headers::getUserId());

            echo $this->returnSuccess("Formas de pagamento encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}