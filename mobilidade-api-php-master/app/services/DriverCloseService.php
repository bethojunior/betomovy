<?php

namespace app\services;
use app\dao\DriversCloseDao;
use app\model\Config;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/11/2019
 * Time: 11:53
 */
class DriverCloseService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new DriversCloseDao;
    }

    /**
     * @param $request
     * @param $userId
     * @return array|mixed|null
     * @throws Exception
     */
    public function findClose($request, $userId)
    {
        $this->validate($request);

        $config = Config::get('show_drivers_close');

        if (!in_array($config, ['only_actives', 'all']))
            return null;

        $result = $this->dao
            ->findClose(
                $request->lat,
                $request->lng,
                $userId,
                $config == 'all');

        return empty($result) ? null : $result;
    }

    /**
     * @param $request
     * @throws Exception
     */
    private function validate($request)
    {
        if (!isset($request->lat) || empty($request->lat))
            throw new Exception("Latitude não é valida");

        if (!isset($request->lng) || empty($request->lng))
            throw new Exception("Longitude não é valida");
    }
}