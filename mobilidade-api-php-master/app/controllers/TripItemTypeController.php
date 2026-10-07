<?php

namespace app\controllers;
use app\services\TripItemTypeService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 16:59
 */
class TripItemTypeController extends ApiController
{
    public function actionAll()
    {
        try {
            echo $this->returnSuccess("Tipos de itens encontrados com sucesso",
                (new TripItemTypeService)
                    ->getAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os tipos de itens");
        }
    }
}