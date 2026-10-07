<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/03/2019
 * Time: 16:24
 */
class DriverCommissionPaymentFormDao extends BaseDao
{
    protected $table = "driverCommissionPaymentForm";

    public function findByCommissionId($driverCommissionId)
    {
        return $this->sqlSelect(
            [],
            [['driverCommissionId', '=', ':driverCommissionId']]
        )
            ->bind([':driverCommissionId' => $driverCommissionId])
            ->get();
    }
}