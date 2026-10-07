<?php

namespace app\services;
use app\dao\LocationDao;
use Exception;
use app\model\Location;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2020
 * Time: 15:47
 */
class LocationService
{
    /**
     * @var LocationDao
     */
    private $dao;

    public function __construct()
    {
        $this->dao = new LocationDao;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function insert($request)
    {
        $location = $request[0] ?? null;

        if (!$location)
            return false;

        return $this->dao
            ->insert(new Location($location));
    }
}