<?php

namespace app\controllers;

use app\services\PartnerService;
use app\services\PartnerTripService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 07/05/2019
 * Time: 16:37
 */
class PartnerController extends ApiController
{
    public function actionRequestPartnership()
    {
        try {
            echo $this->returnSuccess("Parceria solicitada com sucesso",
                (new PartnerService)
                    ->requestPartnership($this->request(false)));
        } catch (Exception $exception) {
            echo $this->returnError($exception);
        }
    }

    public function actionFindByUser()
    {
        try {
            echo $this->returnSuccess("Dados do parceiro encontrados com sucesso",
                (new PartnerService)
                    ->findByUser($this->request(false)->userId ?? null)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionNewTrip()
    {
        try {
            echo $this->returnSuccess("Viagem iniciado com sucesso",
                (new PartnerTripService)
                    ->newTrip($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetActiveTrips()
    {
        try {
            echo $this->returnSuccess("Listando viagens do parceiro",
                (new PartnerService)
                    ->getTrips(
                        $this->request(false)->userId ??
                        Headers::getUserId())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}