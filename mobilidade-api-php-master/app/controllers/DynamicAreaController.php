<?php

namespace app\controllers;
use app\services\DynamicAreaService;
use Exception;

class DynamicAreaController extends ApiController
{
    public function actionFindAll()
    {
        $request = $this->requestQuery();
        try {
            echo $this->returnSuccess("Dinamica por área",
                (new DynamicAreaService)->findAllByPosition($request->lat, $request->lng, $request->timeCurrent ?? null)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar dinamica por área");
        }
    }
}