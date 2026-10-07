<?php

namespace app\controllers;
use app\services\TripTypeService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 16:36
 */
class TripTypeController extends ApiController
{
    public function actionActives()
    {
        try {
            echo $this->returnSuccess("Tipos de viagens encontradas",
                (new TripTypeService)
                    ->findActives()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar tipos de viagens");
        }
    }

    public function actionFindByLocale()
    {
        try {
            $result = (new TripTypeService)
                ->findByLocale($this->requestQuery());

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}