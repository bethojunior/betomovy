<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/12/2019
 * Time: 11:32
 */
class MilitaryForceDao extends BaseDao
{
    protected $table = "militaryForce";

    public function findAll()
    {
        return $this->sqlSelect()
            ->get();
    }
}