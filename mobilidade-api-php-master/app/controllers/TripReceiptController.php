<?php

namespace app\controllers;
use app\services\TripReceiptService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/03/2019
 * Time: 09:55
 */
class TripReceiptController extends ApiController
{
    public function actionSendCustomer()
    {
        try {
            $tripReference = $_GET['t'] ?? null;

            if (!$tripReference)
                throw new Exception("Parâmetros incorretos");

            echo $this->returnSuccess("Recibo enviado",
                (new TripReceiptService)
                    ->sendToCustomer($tripReference)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao enviar recibo");
        }
    }
}