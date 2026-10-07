<?php

namespace app\services;
use app\dao\CityCallConfigDao;
use app\model\Origin;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/02/2019
 * Time: 08:46
 */
class CityCallConfigService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new CityCallConfigDao;
    }

    public function findAll($cityId, ?Origin $origin = null)
    {
        if ($origin)
            $configs = $this->dao
                ->findByCityArea($origin);

        $configs =
            empty($configs) ? $this->dao->findAll($cityId) : $configs;

        return $configs;
    }
}