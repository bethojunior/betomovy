<?php

namespace app\controllers;
use app\services\CancellationReasonsService;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 08/08/2018
 * Time: 14:20
 */
class CancellationReasonsController extends ApiController
{

    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Listando razões de cancelamento",
                (new CancellationReasonsService)->getActives());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetAllCustomer()
    {
        try {
            echo $this->returnSuccess("Listando razões de cancelamento de cliente",
                (new CancellationReasonsService)->getCustomerActives());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetReports()
    {
        try {
            echo $this->returnSuccess("Listando relatos",
                (new CancellationReasonsService)->getReports());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}