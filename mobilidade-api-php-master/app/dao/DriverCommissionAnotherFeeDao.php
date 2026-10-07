<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/03/2019
 * Time: 16:25
 */
class DriverCommissionAnotherFeeDao extends BaseDao
{
    protected $table = "driverCommissionAnotherFee";

    public function findByDriverCommission($driverCommissionId)
    {
        return $this->sqlSelect(
            [],
            [['driverCommissionId', '=', ':driverCommissionId']],
            [],
            1
        )
            ->bind([':driverCommissionId' => $driverCommissionId])
            ->get(false);
    }
}