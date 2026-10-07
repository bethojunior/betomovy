<?php

namespace app\controllers;
use app\dao\StationDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 13/07/2018
 * Time: 10:58
 */
class StationController extends ApiController
{
    protected $stationDao;

    public function __construct()
    {
        $this->stationDao = new StationDao;
    }

    public function actionGet()
    {
        try {
            echo $this->returnSuccess("Listando postos", $this->stationDao->sqlSelect()->get());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetByCity()
    {
        $request = $this->request();

        try {
            echo $this->returnSuccess("Listando postos por cidade",
                $this->stationDao->getByCity($request->cityId, $request->stationTypeId ?? null));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetByDriver()
    {
        try {
            echo $this->returnSuccess("Listando postos do motorista",
                $this->stationDao->getByDriver($this->request()->driverId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionInsertByDriver()
    {
        try {
            echo $this->returnSuccess("Posto inserido",
                $this->stationDao->insertByDriver($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDeleteByDriver()
    {
        $request = $this->request();

        try {
            echo $this->returnSuccess("Posto deletado",
                $this->stationDao->deleteByDriver($request->driverId, $request->stationId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionEdit()
    {
        try {
            echo $this->returnSuccess("Posto Atualizado",
                $this->stationDao->edit($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}