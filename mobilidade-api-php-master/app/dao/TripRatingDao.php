<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2019
 * Time: 11:40
 */
class TripRatingDao extends BaseDao
{
    protected $table = "tripRating";

    /**
     * @param $tripReference
     * @return array|mixed
     */
    public function findByTrip($tripReference)
    {
        return $this->sqlSelect([],
            [['tripReference', '=', ':tripReference']]
        )
            ->bind([':tripReference' => $tripReference])
            ->get();
    }

    public function getAverageRating($userId, $limit = null)
    {
        $sql = "
            SELECT
              ((({$limit} - SUM(if(tr.statusId = 1, 1, 0))) * 5) + SUM(if(tr.statusId = 1, tr.rating, 0))) / {$limit} AS avg
            FROM {$this->table} tr
              WHERE tr.ratedUser = :userId
            LIMIT {$limit};
        ";

        $bind = [':userId' => $userId];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}