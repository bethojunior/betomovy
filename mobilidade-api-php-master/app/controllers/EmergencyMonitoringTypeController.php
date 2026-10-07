<?php

namespace app\controllers;
use app\dao\EmergencyMonitoringTypeDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2019
 * Time: 16:14
 */
class EmergencyMonitoringTypeController extends ApiController
{
    public function actionFindAll()
    {
        try {
            $result = (new EmergencyMonitoringTypeDao)
                ->findAll();

            echo $this->returnSuccess("Tipos de emergências encontrados", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os tipos de emergências");
        }
    }
}