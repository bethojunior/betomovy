<?php

namespace app\controllers;
use app\services\DocService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/08/2020
 * Time: 11:44
 */
class DocController extends ApiController
{
    public function actionFindAll()
    {
        try {
            $result = (new DocService)
                ->findAll();

            echo $this->returnSuccess("Documentos encontrados", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os documentos");
        }
    }
}