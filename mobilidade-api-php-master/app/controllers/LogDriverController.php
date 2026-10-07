<?php

namespace app\controllers;
use app\dao\LogDriverDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/02/2019
 * Time: 14:04
 */
class LogDriverController extends ApiController
{
    public function actionInsert()
    {
        try {
            echo $this->returnSuccess("Log inserido",
                (new LogDriverDao)->insertMany($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir log");
        }
    }
}