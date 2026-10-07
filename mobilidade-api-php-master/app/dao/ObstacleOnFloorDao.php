<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/07/2019
 * Time: 11:20
 */
class ObstacleOnFloorDao extends BaseDao
{
    protected $table = 'obstacleOnFloor';

    public function getAll()
    {
        return $this->sqlSelect(['id', 'description'], [
            ['statusId', '=', ':statusId']
        ])
            ->bind([':statusId' => Status::ATIVO])
            ->get();
    }
}