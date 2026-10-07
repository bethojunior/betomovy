<?php

namespace app\controllers;
use app\services\DocUserTypeService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2020
 * Time: 09:37
 */
class DocUserTypeController extends ApiController
{
    public function actionFindByUserType()
    {
        try {
            $result = (new DocUserTypeService)
                ->findByUserType($this->requestQuery());

            echo $this->returnSuccess("Documentos encontrados", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os documentos por tipo de usuario");
        }
    }
}