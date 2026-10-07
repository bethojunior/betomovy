<?php

namespace app\controllers;
use app\services\PricePartnerService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/05/2019
 * Time: 09:20
 */
class PricePartnerController extends ApiController
{
    public function actionCalculate()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Preços calculados",
                (new PricePartnerService)->calculateAllPrice($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar preço");
        }
    }
}