<?php

namespace app\controllers;
use app\services\TripBidService;
use Exception;

class TripBidController extends ApiController
{
    public function actionCreate()
    {
        try {
            echo $this->returnSuccess("Lance feito com sucesso",
                (new TripBidService)->create($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindTripBidByDriver()
    {
        try {
            echo $this->returnSuccess("Lance encontrado",
                (new TripBidService)->findTripBidByDriver($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetBidsByTrip()
    {
        try {
            echo $this->returnSuccess("Obter lances por viagem",
                (new TripBidService)->getBidsByTrip($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionAcceptOffer()
    {
        try {
            echo $this->returnSuccess("Lance aceito",
                (new TripBidService)->acceptOffer($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionAcceptOfferByDriver()
    {
        try {
            echo $this->returnSuccess("Oferta aceita",
                (new TripBidService)->acceptOfferByDriver($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRefuse()
    {
        try {
            echo $this->returnSuccess("Oferta recusada",
                (new TripBidService)->refuse($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionChangePriceTrip()
    {
        try {
            echo $this->returnSuccess("Valor da oferta alterado",
                (new TripBidService)->changePriceTrip($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}