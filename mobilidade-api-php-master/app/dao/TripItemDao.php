<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 17:39
 */
class TripItemDao extends BaseDao
{
    protected $table = 'tripItem';

    public function findByTripReference($tripReference)
    {
        $sql = "
            SELECT
                ti.id,
                ti.tripItemTypeId,
                ti.tripReference,
                tit.name AS tripItemType,
                tit.picture
            FROM {$this->table} ti
                INNER JOIN tripItemType tit ON ti.tripItemTypeId = tit.id
            WHERE ti.tripReference = :tripReference
        ";

        return $this->sqlRawSelect($sql, [':tripReference' => $tripReference])
            ->first();
    }
}