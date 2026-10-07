<?php

namespace app\controllers;
use app\services\DriverTripScheduled;
use app\services\FreightPictureService;
use app\services\NewFreightService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/09/2019
 * Time: 14:44
 */
class FreightController extends ApiController
{
    public function actionNew()
    {
        try {
            echo $this->returnSuccess("Frete solicitado",
                (new NewFreightService)->new($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao solicitar frete");
        }
    }

    public function actionAcceptScheduled()
    {
        try {
            echo $this->returnSuccess("Frete agendado com sucesso",
                (new DriverTripScheduled)->accept($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionPicture()
    {
        try {
            echo $this->returnSuccess("Fotos inseridas com sucesso",
                (new FreightPictureService)
                    ->uploadImages($this->postRequest('tripReference', false) ?? null, $_FILES)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os agendamentos");
        }
    }
}