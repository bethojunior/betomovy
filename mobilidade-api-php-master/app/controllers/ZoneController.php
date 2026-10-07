<?php

namespace app\controllers;
use app\dao\ZoneDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 25/07/2018
 * Time: 13:23
 */
class ZoneController extends ApiController
{
    protected $zoneDao;

    public function __construct()
    {
        $this->zoneDao = new ZoneDao;
    }

    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Lista de zonas", $this->zoneDao->getDefaultZones());
        } catch (Exception $e) {
            echo $this->returnError();
        }
    }
}