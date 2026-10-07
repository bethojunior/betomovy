<?php

namespace app\controllers;
use app\services\DeliveryInfoSuggestionService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 17:57
 */
class DeliveryInfoController extends ApiController
{
    public function actionSuggestion()
    {
        try {
            echo $this->returnSuccess("Sugestões encontradas",
                (new DeliveryInfoSuggestionService)
                    ->find()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar sugestões");
        }
    }
}