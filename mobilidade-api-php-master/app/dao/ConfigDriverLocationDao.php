<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/04/2019
 * Time: 15:27
 */
class ConfigDriverLocationDao extends BaseDao
{
    protected $table = "configDriverLocation";

    public function find()
    {
        return $this->sqlSelect([], [], [], 1)
            ->get(false);
    }
}