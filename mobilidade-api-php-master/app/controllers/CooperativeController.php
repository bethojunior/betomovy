<?php

namespace app\controllers;
use app\dao\CooperativeDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 22/08/2018
 * Time: 09:45
 */
class CooperativeController extends ApiController
{
    public function actionGetByStation()
    {
        try {
            echo $this->returnSuccess("Listando cooperativas", (new CooperativeDao)
                ->getByStation($this->request()->stationId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}