<?php

namespace app\controllers;
use app\dao\LogDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 14/09/2018
 * Time: 14:36
 */
class LogController extends ApiController
{
    public function actionInsertMany()
    {
        $request = $this->request();

        try {
            echo $this->returnSuccess("Logs inseridos",
                (new LogDao)->insertMany($request->logs)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}