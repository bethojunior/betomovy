<?php

namespace app\controllers;
use app\services\ObstacleOnFloorService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/07/2019
 * Time: 11:18
 */
class ObstacleOnFloorController extends ApiController
{
    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Obstáculos encontrados",
                (new ObstacleOnFloorService)->all()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao encontrar obstáculos");
        }
    }
}