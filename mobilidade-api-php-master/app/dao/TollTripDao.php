<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/08/2020
 * Time: 10:32
 */
class TollTripDao extends BaseDao
{
    protected $table = 'tollTrip';

    public function findByTrip(int $idTrip)
    {
        $sql = "
            SELECT
                tt.id,
                tt.tripId,
                tt.tollId,
                t.name,
                t.address,
                t.value
            FROM {$this->table} tt
                INNER JOIN toll t ON tt.tollId = t.id
                WHERE 
                    tt.tripId = :tripId
        ";

        $bind = [':tripId' => $idTrip];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}