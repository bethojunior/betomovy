<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/01/2019
 * Time: 11:21
 */
class PlaceTypeDao extends BaseDao
{
    protected $table = "placeType";

    public function getAll()
    {
        return $this->sqlSelect()
            ->get();
    }
}