<?php

namespace app\controllers;
use app\services\TripRefusedService;
use Exception;

class TripRefusedController extends ApiController
{
    public function actionCreate()
    {
        try {
            echo $this->returnSuccess("Recusa de viagem criado com sucesso",
                (new TripRefusedService)->create($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGet()
    {
        $request = $this->request();

        try {
            echo $this->returnSuccess("Recusa de viagem encontrada com sucesso",
                (new TripRefusedService)->find($request->id)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDelete()
    {
        $request = $this->request();

        try {
            echo $this->returnSuccess("Recusa de viagem deletada com sucesso",
                (new TripRefusedService)->delete($request->id)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}