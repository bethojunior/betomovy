<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 21:15
 */
class RideDao extends BaseDao
{
    public function find($rideId)
    {
        return $this->sqlSelect([], [
            ['id', '=', ':rideId']
        ])
            ->bind([':rideId' => $rideId])
            ->first();
    }

    public function findByTrip($tripReference)
    {
        return $this->sqlSelect([], [
            ['tripReference', '=', ':tripReference']
        ], [], 1)
            ->bind([':tripReference' => $tripReference])
            ->first();
    }

    public function findOfferedRides($driverId)
    {
        $sql = "
            SELECT
                r.id as rideId,
                r.tripReference,
                r.driverId,
                r.routeId,
                r.created_at,
                tS.schedule,
                t.status,
                ro.name,
                t.price,
                ro.statusId,
                r.routeLayout,
                IF(
                    ro.picture IS NULL,
                    CONCAT(
                        (SELECT
                            config.value
                        FROM config
                            WHERE config.`key` = 'link_storage_pictures'),
                        ro.picture
                    ),
                    null
                ) AS picture
            FROM ride r
                INNER JOIN trip t ON r.tripReference = t.tripReference
                INNER JOIN tripScheduled tS on t.tripReference = tS.tripReference
                INNER JOIN route ro ON r.routeId = ro.id
              WHERE
                r.driverId = :driverId AND
                t.status NOT IN (:canceled, :finished, :preAccepted)
                AND ro.statusId NOT IN (2)
              ORDER BY r.created_at
        ";

        $bind = [
            ':driverId' => $driverId,
            ':canceled' => Trip::CANCELED,
            ':finished' => Trip::FINISHED,
            ':preAccepted' => Trip::PRE_ACCEPTED,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}