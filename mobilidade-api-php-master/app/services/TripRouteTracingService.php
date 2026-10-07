<?php

namespace app\services;
use app\dao\TripRouteTracingDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/11/2019
 * Time: 08:47
 */
class TripRouteTracingService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new TripRouteTracingDao;
    }

    /**
     * @param $request
     * @return array|mixed|null
     * @throws Exception
     */
    public function findByTrip($request)
    {
        if (!isset($request->tripReference))
            throw new Exception("ID trip não foi enviado");

        $tracing = $this->dao
            ->findByTrip($request->tripReference);

        return empty($tracing) ? null : $tracing;
    }
}