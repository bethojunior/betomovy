<?php

namespace app\services;
use app\dao\PriceDao;
use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/11/2019
 * Time: 17:59
 */
class TripPriceService
{
    private $priceDao;

    public function __construct()
    {
        $this->priceDao = new PriceDao;
    }

    /**
     * @param $request
     * @return null|stdClass
     * @throws Exception
     */
    public function find($request)
    {
        if (!isset($request->tripReference))
            throw new Exception("ID trip não foi enviado");

        $price = $this->priceDao
            ->findByTrip($request->tripReference);

//        $price = $this->priceDao
//            ->findById($trip->priceId);

        return empty($price) ? null : $price->toStdClass();
    }
}