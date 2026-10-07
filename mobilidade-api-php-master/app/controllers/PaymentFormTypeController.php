<?php

namespace app\controllers;
use app\services\PaymentFormTypeService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/10/2019
 * Time: 13:51
 */
class PaymentFormTypeController extends ApiController
{
    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Tipos de formas de pagamento encontradas",
                (new PaymentFormTypeService)
                    ->getAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar tipos de formas de pagamento");
        }
    }
}