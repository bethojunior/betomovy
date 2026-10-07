<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 09:48
 */
class TripReportTypeDao extends BaseDao
{
    protected $table = "tripReportType";

    public function getAll()
    {
        return $this->sqlSelect(['idTripReportType', 'name'], [
            ['statusId', '=', ':statusId']
        ])
            ->bind([':statusId' => Status::ATIVO])
            ->get();
    }
}