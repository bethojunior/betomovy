<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2020
 * Time: 10:32
 */
class RideItemsDao extends BaseDao
{
    protected $table = 'rideItems';

    public function findByRide($rideId)
    {
        $sql = "
            SELECT
                ri.id AS rideItemId,
                ri.routeTripItemTypeId,
                rtit.tripItemTypeId,
                rtit.value,
                tit.name,
                CONCAT(c.value, 'tripItemType/', tit.picture) AS picture
            FROM {$this->table} ri
                INNER JOIN routeTripItemType rtit ON rtit.id = ri.routeTripItemTypeId
                INNER JOIN tripItemType tit ON tit.id = rtit.tripItemTypeId
                INNER JOIN config c ON c.`key` = 'link_storage_pictures'
                WHERE
                    ri.rideId = :rideId
        ";

        $bind = [':rideId' => $rideId];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}