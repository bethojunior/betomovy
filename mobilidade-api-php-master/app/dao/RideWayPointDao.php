<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/05/2020
 * Time: 18:21
 */
class RideWayPointDao extends BaseDao
{
    protected $table = "rideWayPoint";

    public function findByRiderTripCustomer(int $riderTripCustomerId)
    {
        $sql = "
            SELECT
                rwp.*,
                rPST.name AS routePitStopType
            FROM {$this->table} rwp
                INNER JOIN routePitStopType rPST ON rPST.id = rwp.routePitStopTypeId
                WHERE
                    rwp.riderTripCustomerId = :riderTripCustomerId
        ";

        $bind = [':riderTripCustomerId' => $riderTripCustomerId];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}