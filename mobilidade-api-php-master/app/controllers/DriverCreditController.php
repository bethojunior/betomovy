<?php

namespace app\controllers;

use app\services\payment\account\DriverCreditService;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/05/2020
 * Time: 08:38.
 */
class DriverCreditController extends ApiController
{
    public function actionAddViaPix()
    {
        try {
            $result = (new DriverCreditService())
                ->generatePixTransaction($this->request(false));

            echo $this->returnSuccess('Crédito solicitado', $result);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionShowCreditPix()
    {
        try {
            $result = (new DriverCreditService())
                ->getCreditPixRequest($this->request(false));

            echo $this->returnSuccess('Sucesso', $result);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }
}
