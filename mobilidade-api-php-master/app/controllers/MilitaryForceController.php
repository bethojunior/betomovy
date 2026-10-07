<?php

namespace app\controllers;
use app\services\MilitaryForceService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/12/2019
 * Time: 11:32
 */
class MilitaryForceController extends ApiController
{
    public function actionGetAll()
    {
        try {
            $result = (new MilitaryForceService)->findAll();

            echo $this->returnSuccess(
                "Forças militares encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGraduations()
    {
        try {
            $result = (new MilitaryForceService)
                ->findGraduations($this->requestQuery());

            echo $this->returnSuccess("Graduações encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar graduações");
        }
    }

    public function actionStatus()
    {
        try {
            $result = (new MilitaryForceService)
                ->findAllStatus();

            echo $this->returnSuccess("Status encontrados", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os status");
        }
    }
}