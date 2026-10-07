<?php

namespace app\controllers;
use app\dao\EstablishmentDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 25/07/2018
 * Time: 15:19
 */
class NeighborhoodController extends ApiController
{
    public function actionGetAll()
    {
        $cityId = $_GET['city'] ?? null;
        try {
            $establishmentDao = new EstablishmentDao;
            echo $this->returnSuccess("Listando bairros onde possui estabelecimentos",
                [
                    "neighborhoods" => $establishmentDao->getNeighborhoods($cityId),
                    "price" => $establishmentDao->getMinAndMaxPriceByCity($cityId)
                ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}