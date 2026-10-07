<?php

namespace app\controllers;
use app\services\TripReportTypeService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 09:46
 */
class TripReportTypeController extends ApiController
{
    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Listando tipos de ocorrências da viagem",
                (new TripReportTypeService)
                    ->findAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}