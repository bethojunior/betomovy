<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/01/2019
 * Time: 18:14
 */
class FlowTypeDao extends BaseDao
{
    protected $table = "flowType";

    public function getAll()
    {
        return $this->sqlSelect()
            ->get();
    }
}