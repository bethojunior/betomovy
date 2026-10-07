<?php

namespace app\controllers;
use app\dao\CityDao;
use app\services\CityConfigService;
use app\services\CityService;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 18/07/2018
 * Time: 14:18
 */
class CityController extends ApiController
{
    protected $cityDao;

    public function __construct()
    {
        $this->cityDao = new CityDao;
    }

    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Lista de cidades", $this->cityDao->getByEstate($_GET['estado'] ?? null));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetConfig()
    {
        try {
            echo $this->returnSuccess("Configurações encontradas",
                (new CityConfigService)
                    ->findFully(
                        $this->request(false)
                    )
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configurações da cidade");
        }
    }

    public function actionGetActives()
    {
        try {
            echo $this->returnSuccess("Cidades encontradas", (new CityService)->findActives());
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar as cidades");
        }
    }
}