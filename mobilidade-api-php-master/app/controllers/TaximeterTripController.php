<?php

namespace app\controllers;

use app\services\TaximeterTripService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/06/2020
 * Time: 14:14
 */
class TaximeterTripController extends ApiController
{
    public function actionStart()
    {
        try {
            $request = $this->request(false);
            $result = (new TaximeterTripService)->init($request);

            echo $this->returnSuccess('Viagem iniciada', $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir viagem");
        }
    }

    public function actionUpdate()
    {
        try {
            $request = $this->request(false);

            $result = (new TaximeterTripService)->update($request);

            echo $this->returnSuccess('Viagem atualizada', $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao atualizar viagem");
        }
    }

    public function actionFinalize()
    {
        try {
            $request = $this->request(false);

            $result = (new TaximeterTripService)->updateEstimatedTripTimeAndDistance($request->tripReference, $request->distance, $request->estimatedTripTime, $request->price);

            echo $this->returnSuccess("Viagem taximetro finalizada com sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao finalizar viagem");
        }
    }
}
