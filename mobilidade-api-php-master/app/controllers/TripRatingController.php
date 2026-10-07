<?php

namespace app\controllers;
use app\services\TripRatingService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2019
 * Time: 11:45
 */
class TripRatingController extends ApiController
{
    public function actionRate()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Viagem avaliada",
                (new TripRatingService)
                    ->rate($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao avaliar a viagem');
        }
    }
}