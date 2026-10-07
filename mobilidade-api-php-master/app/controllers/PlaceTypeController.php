<?php

namespace app\controllers;
use app\services\PlaceTypeService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/01/2019
 * Time: 11:22
 */
class PlaceTypeController extends ApiController
{
    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Tipos de lugares encontrados",
                (new PlaceTypeService)
                    ->getAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os tipos de lugares");
        }
    }
}