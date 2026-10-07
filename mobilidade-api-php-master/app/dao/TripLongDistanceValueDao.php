<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2020
 * Time: 19:33
 */
class TripLongDistanceValueDao extends BaseDao
{
    protected $table = 'tripLongDistanceValue';

    public function findByDriverAndTrip(int $tripId, int $driverId)
    {
        $sql = "
            SELECT
                tld.*
            FROM {$this->table} tld
                WHERE
                    tld.tripId = :idTrip AND
                    tld.driverId = :driverId
        ";

        $bind = [
            ':idTrip' => $tripId,
            ':driverId' => $driverId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->first();
    }
}