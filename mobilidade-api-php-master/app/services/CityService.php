<?php

namespace app\services;
use app\dao\CityDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/07/2019
 * Time: 09:15
 */
class CityService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new CityDao;
    }

    public function findCityByCoordinate($latitude, $longitude)
    {
        $city = $this->dao
            ->findByCoordinate($latitude, $longitude);

        return $city;
    }

    public function findActives()
    {
        $cities = $this->dao->findActives();

        return $cities;
    }
}