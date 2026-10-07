<?php

namespace app\controllers;

use app\constant\RecalculatedTripTypeConst;
use app\services\RecalculatedPriceService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/01/2020
 * Time: 15:57
 */
class TripLongDistanceController extends ApiController
{
    public function actionRecalculate()
    {
        try {
            echo $this->returnSuccess("Preço recalculado com sucesso",
                (new RecalculatedPriceService)
                    ->create($this->request(false), RecalculatedTripTypeConst::LONG_DISTANCE_RECALCULATION));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}