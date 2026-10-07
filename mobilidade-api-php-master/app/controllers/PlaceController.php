<?php

namespace app\controllers;
use app\services\PlaceSearchService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/07/2019
 * Time: 15:05
 */
class PlaceController extends ApiController
{
    public function actionSearch()
    {
        try {
            echo $this->returnSuccess("Sugestões encontradas",
                (new PlaceSearchService)->search($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar sugestões de lugares');
        }
    }
}