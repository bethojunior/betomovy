<?php

namespace app\controllers;
use app\services\ItemService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/07/2019
 * Time: 10:38
 */
class ItemController extends ApiController
{
    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Itens encontrados com sucesso",
                (new ItemService)->getAll($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os itens");
        }
    }
}