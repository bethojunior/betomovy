<?php

namespace app\controllers;
use app\dao\StationTypeDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 13/07/2018
 * Time: 11:33
 */
class StationTypeController extends ApiController
{
    protected $stationTypeDao;

    public function __construct()
    {
        $this->stationTypeDao = new StationTypeDao;
    }

    public function actionGet()
    {
        try {
            echo $this->returnSuccess("Sucesso",
                $this->stationTypeDao->sqlSelect(['idStationType', 'name'])->get());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}