<?php

namespace app\controllers;
use app\services\GeocodingSearchService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/10/2019
 * Time: 09:13
 */
class GeocodingController extends ApiController
{
    public function actionSearch()
    {
        try {
            echo $this->returnSuccess(
                "Endereço encontrado",
                (new GeocodingSearchService)->search($this->requestQuery()));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar endereço");
        }
    }
}