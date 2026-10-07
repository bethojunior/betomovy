<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/04/2019
 * Time: 15:14
 */
class CityAreaDao extends BaseDao
{
    protected $table = "cityArea";

    public function findCity($lat, $lng)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} ca
              WHERE 
                GeomFromText('POINT(:lat :lng)') = true AND
                cd.
        ";
    }
}