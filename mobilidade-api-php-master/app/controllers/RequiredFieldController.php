<?php

namespace app\controllers;
use app\services\RequiredFieldService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/08/2019
 * Time: 10:48
 */
class RequiredFieldController extends ApiController
{
    public function actionGet()
    {
        try {
            $request = $this->requestQuery();

            echo $this->returnSuccess("Campos obrigatórios encontrados com sucesso",
                (new RequiredFieldService)
                    ->find($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os campos obrigatórios");
        }
    }
}