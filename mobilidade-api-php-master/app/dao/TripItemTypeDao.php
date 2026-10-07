<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 16:57
 */
class TripItemTypeDao extends BaseDao
{
    protected $table = 'tripItemType';

    public function getAll()
    {
        return $this->sqlSelect([],
            [['statusId', '=', Status::ATIVO]])
            ->get();
    }
}