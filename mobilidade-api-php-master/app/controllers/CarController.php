<?php

namespace app\controllers;

use app\dao\CarDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 09/09/2018
 * Time: 10:06
 */
class CarController extends ApiController
{
    public function actionInsert()
    {
        try {
            echo $this->returnSuccess("Carro cadastrado",
                (new CarDao)->insert($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionInsertSecondCar()
    {
        try {
            $request = $this->request(false, true);
            $request->car->document = $_FILES['document'] ?? null;

            echo $this->returnSuccess("Carro cadastrado, em espera da aprovação no painel",
                (new CarDao)->insertSecondCar($request->car)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetByDriver()
    {
        try {
            echo $this->returnSuccess("Carro encontrado",
                (new CarDao)->getCarByDriver($this->request()->driverId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Carros encontrados",
                (new CarDao)->getAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindAllPendingByDriver()
    {
        if (!isset($this->requestQuery()->driverId)) {
            echo $this->returnError(null, "ID do motorista não encontrado!");
            return;
        }
        try {
            echo $this->returnSuccess("Carros encontrados",
                (new CarDao)->findAllPendingByDriver($this->requestQuery()->driverId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}