<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/12/2019
 * Time: 11:58
 */
class MilitaryStatusDao extends BaseDao
{
    protected $table = "militaryStatus";

    public function getAll()
    {
        return $this->sqlSelect()
            ->get();
    }
}