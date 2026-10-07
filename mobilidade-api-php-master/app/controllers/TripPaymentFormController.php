<?php

namespace app\controllers;
use app\dao\TripPaymentFormDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/10/2018
 * Time: 17:33
 */
class TripPaymentFormController extends ApiController
{
    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Listando formas de pagamento da viagem",
                (new TripPaymentFormDao)->getAll($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}