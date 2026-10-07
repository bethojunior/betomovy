<?php

namespace app\controllers;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 10/09/2018
 * Time: 12:09
 */
class TripTimelineStatusController extends ApiController
{
    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Timeline dos status de viagem encontrados",
                (new TripTimelineStatusDao)->getAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}