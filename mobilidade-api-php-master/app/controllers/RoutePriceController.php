<?php

namespace app\controllers;
use app\dao\RoutePriceDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 23/07/2018
 * Time: 10:07
 */
class RoutePriceController extends ApiController
{
    protected $routePriceDao;

    public function __construct()
    {
        $this->routePriceDao = new RoutePriceDao;
    }

    public function actionCheckPrice()
    {
        $request = $this->request();
        try {
            echo $this->returnSuccess("Preco", $this->routePriceDao->checkPrice($request->establishmentId, $request->stationId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }


}