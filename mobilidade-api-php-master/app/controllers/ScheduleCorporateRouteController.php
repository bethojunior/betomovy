<?php


namespace app\controllers;
use app\services\ScheduleCorporateRouteService;
use Exception;

class ScheduleCorporateRouteController extends ApiController
{
    public function actionAvailableOnDate()
    {
        try {
            echo $this->returnSuccess("Lista de rotas corporativas disponivel por data",
                (new ScheduleCorporateRouteService)->availableOnDate($this->request(false)));
        } catch (Exception $exception) {
            echo $this->returnError($exception);
        }
    }

    public function actionCreateSchedule()
    {
        try {
            echo $this->returnSuccess("Agendamento de rota criada com sucesso",
                (new ScheduleCorporateRouteService)->new($this->request(false)));
        } catch (Exception $exception) {
            echo $this->returnError($exception);
        }
    }

    public function actionTripsByDriver()
    {
        try {
            echo $this->returnSuccess("Lista de viagem agendadas",
                (new ScheduleCorporateRouteService)->tripsByDriver($this->request(false)));
        } catch (Exception $exception) {
            echo $this->returnError($exception);
        }
    }
}