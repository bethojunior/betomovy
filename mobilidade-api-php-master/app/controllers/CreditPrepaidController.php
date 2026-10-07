<?php

namespace app\controllers;

use app\services\CreditPrepaidPurchaseService;
use app\services\CreditPrepaidService;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/05/2020
 * Time: 08:38.
 */
class CreditPrepaidController extends ApiController
{
    public function actionList()
    {
        try {
            $cityId = $_GET['cityId'] ?? null;

            $result = (new CreditPrepaidService())->findAll($cityId);

            echo $this->returnSuccess('Créditos Pré-pago encontrados', $result);
        } catch (\Exception $e) {
            echo $this->returnError($e, '', 400);
        }
    }

    public function actionPurchase()
    {
        try {
            $result = (new CreditPrepaidPurchaseService())
                ->purchase($this->request(false));

            echo $this->returnSuccess('Crédito solicitado', $result);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }
    
    public function actionShow()
    {
        try {
            $result = (new CreditPrepaidPurchaseService())
                ->getCreditPrepaidPurchase($this->request(false)->creditPrepaidPurchaseId);

            echo $this->returnSuccess('Crédito solicitado', $result);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }
}
