<?php


namespace app\controllers;
use app\dao\DynamicDao;
use Exception;

class DynamicController extends ApiController
{
    public function actionLastDynamicsPlaces()
    {
        try {
            if (!$this->requestQuery()->latitude || !$this->requestQuery()->longitude) throw new Exception('Localização não enviada');
            echo $this->returnSuccess("Locais onde tiveram as últimas dinânimas do dia",
                (new DynamicDao())->lastDynamicsPlaces($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionExpensiveDynamicsPlaces()
    {
        try {
            if (!$this->requestQuery()->latitude || !$this->requestQuery()->longitude) throw new Exception('Localização não enviada');
            echo $this->returnSuccess("Locais onde tiveram as dinâmicas mais caras do dia",
                (new DynamicDao())->expensiveDynamicsPlaces($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionPlacesMoreTripsDayAgo()
    {
        try {
            if (!$this->requestQuery()->latitude || !$this->requestQuery()->longitude) throw new Exception('Localização não enviada');
            echo $this->returnSuccess("Locais onde tiveram mais viagens há um dia",
                (new DynamicDao())->placesMoreTripsDayAgo($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionPlacesMoreTripsWeekAgo()
    {
        try {
            if (!$this->requestQuery()->latitude || !$this->requestQuery()->longitude) throw new Exception('Localização não enviada');
            echo $this->returnSuccess("Locais onde tiveram mais viagens há uma semana",
                (new DynamicDao())->placesMoreTripsWeekAgo($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}