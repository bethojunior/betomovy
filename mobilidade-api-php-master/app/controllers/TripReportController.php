<?php

namespace app\controllers;
use app\services\TripReportCustomerService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 10:07
 */
class TripReportController extends ApiController
{

    public function actionInsertByCustomer()
    {
        try {
            $tripReport = (new TripReportCustomerService)
                ->insert($this->request(false));

            echo $this->returnSuccess("Ocorrência inserida",
                $tripReport->toStdClass()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}