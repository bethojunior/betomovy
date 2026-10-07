<?php

namespace app\controllers;
use app\services\PriceCustomerService;
use Exception;
use app\model\Location;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 11/09/2018
 * Time: 14:53
 */
class PriceController extends ApiController
{
    public function actionFindByTripType()
    {
        try {
            $request = $this->requestQuery();

            echo $this->returnSuccess("Tarifa encontrada",
                (new PriceCustomerService)->findFare($request));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar preço");
        }
    }

    public function actionCalculate()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Preço calculado",
                (new PriceCustomerService)->getTripPrice(
                    new Location($request->origin),
                    new Location($request->destiny),
                    $request->tripTypeId ?? null,
                    $request->waypoints ?? []
                )
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar preço");
        }
    }

    public function actionAvailableTripTypes()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Categorias encontradas",
                (new PriceCustomerService)->getAvailableTripTypes(
                    new Location($request->origin),
                    $request->onlyCentral ?? null,
                    $request->noDestination ?? false,
                )
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar categorias");
        }
    }

    public function actionCalculateAll()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Preços calculados",
                (new PriceCustomerService)->getAllTripPrices(
                    new Location($request->origin),
                    new Location($request->destiny),
                    $request->waypoints ?? null,
                    $request->time ?? null,
                    $request->onlyCentral ?? null,
                    $request->noDestination ?? false,
                    $request->timeCurrent ?? null,
                )
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar preços");
        }
    }

    public function actionPreviewNewPriceInChangeRoute()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Mostrar novo valor",
                (new PriceCustomerService)->previewNewPriceInChangeRoute(
                    $request->tripReference,
                    $request->destination,
                    $request->waypoints ?? [],
                    $request->kmProgressing ?? 0,
                    $request->minuteProgressing ?? 0,
                    $request->timeCurrent ?? null,
                    $request->multiplierDynamicPrice ?? null,
                ));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao tentar mostrar novo valor da rota");
        }
    }

    public function actionGetWaitingTimeFees()
    {
         try {
            $request = $this->request(false);

            echo $this->returnSuccess("Sucesso ao trazer taxas",
                (new PriceCustomerService)->getWaitingTimeFees(
                    $request,
                ));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao tentar trazer taxas");
        } 
    }
}