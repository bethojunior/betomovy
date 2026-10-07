<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2019
 * Time: 15:53
 */
class EmergencyMonitoringTypeDao extends BaseDao
{
    protected $table = "emergencyMonitoringType";

    public function findById($id)
    {
        return $this->sqlSelect([], [
            ['id', '=', ':id']
        ])
            ->bind([':id' => $id])
            ->get(false);
    }

    public function findAll()
    {
        return $this->sqlSelect([], [
            ['statusId', '=', ':statusId']
        ])
            ->bind([':statusId' => Status::ATIVO])
            ->get();
    }
}