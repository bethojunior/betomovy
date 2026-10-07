<?php

namespace app\controllers;
use app\dao\TripDao;
use app\services\RecalculatedPriceService;
use app\services\ReportTripService;
use app\services\TripPriceService;
use app\services\TripService;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 23/07/2018
 * Time: 17:27
 */
class TripController extends ApiController
{
    protected $tripDao;

    public function __construct()
    {
        $this->tripDao = new TripDao;
    }

    public function actionNew()
    {
        try {
            echo $this->returnSuccess("Nova viagem cadastrada", $this->tripDao->new($this->request()));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionIncreaseArea()
    {
        $request = $this->request();
        try {
            echo $this->returnSuccess("Informações da viagem", $this->tripDao->increaseArea($request->tripReference, $request->zoneId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCancel()
    {
        try {
            $request = $this->request();
            echo $this->returnSuccess("Viagem cancelada", $this->tripDao->cancel($request->tripReference, $request->dateEnd, $request->userId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGet()
    {
        try {
            echo $this->returnSuccess("Exibindo viagem", $this->tripDao
                ->findFully($this->request()->tripReference, true));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetById()
    {
        try {
            echo $this->returnSuccess("Viagem encontrada",
                $this->tripDao->findById($this->request()->idTrip)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetWithTimeline()
    {
        try {
            echo $this->returnSuccess("Viagem encontrada",
                $this->tripDao->findWithTimeline($this->request()->tripReference)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionShare()
    {
        try {
            echo $this->returnSuccess("Viagem encontrada",
                $this->tripDao->find($this->request(false)->tripReference, false)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetShareLink()
    {
        try {
            echo $this->returnSuccess("Viagem encontrada",
                (new TripService)->getShareLink($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFinancialDetail()
    {
        try {
            echo $this->returnSuccess("Detalhes financeiros da viagem",
                $this->tripDao->tripFinancialDetail($this->request(false)->tripReference)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao detalhar financeiro da viagem");
        }
    }

    public function actionReport()
    {
        try {
            $tripReport = (new ReportTripService)
                ->insert($this->request(false));

            echo $this->returnSuccess("Report inserido com sucesso",
                $tripReport->toStdClass()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionUpdateRouteTracing()
    {
        try {
            echo $this->returnSuccess("Rota atualizada com sucesso",
                (new TripService)
                    ->updateRouteTracing($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindTripPrice()
    {
        try {
            echo $this->returnSuccess("Preço encontrado",
                (new TripPriceService)->find($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRecalculatePrice()
    {
        try {
            echo $this->returnSuccess("Preço encontrado",
                (new RecalculatedPriceService)->create($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionChangeRoute()
    {
        try {
            echo $this->returnSuccess("Mudança de rota na viagem",
                (new RecalculatedPriceService)->changeRoute($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionPix()
    {
        try {
            echo $this->returnSuccess("Sucesso ao gerar pix.",
                (new TripService)->generatePix($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
    
    public function actionPayWithPixAtEnd()
    {
        try {
            echo $this->returnSuccess("Gerando pagamento com Pix",
                (new TripService)->payWithPixAtEnd($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        } 
    }

    public function actionPixStatus()
    {
        try {
            echo $this->returnSuccess("Status do pagamento com Pix",
                (new TripService)->pixStatus()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionStatus()
    {
        try {
            $tripReference = $this->requestQuery()->tripReference;
            $trip = (new TripService)->getStatusByTripReference($tripReference);
            echo $this->returnSuccess("Status da viagem", $trip);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionActives()
    {
        try {
            echo $this->returnSuccess("Viagens ativas",
                (new TripService)->getActives($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}