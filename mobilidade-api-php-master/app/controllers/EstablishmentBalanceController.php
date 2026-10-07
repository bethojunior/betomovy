<?php

namespace app\controllers;
use app\dao\EstablishmentDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 23/08/2018
 * Time: 15:17
 */
class EstablishmentBalanceController extends ApiController
{
    public function actionGet()
    {
        try {
            echo $this->returnSuccess("Saldo", (new EstablishmentDao)
                ->getBalance($this->request()->establishmentId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}