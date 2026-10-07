<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/01/2019
 * Time: 15:22
 */
class CustomerDestinationHistoryDao extends BaseDao
{
    public function find($userId)
    {
        $sql = "
            SELECT
              d.idDestination,
              d.latitude,
              d.longitude,
              d.address,
              d.cityId,
              d.neighborhood
            FROM destination d
              INNER JOIN trip t on d.idDestination = t.destinationId
            WHERE t.userId = :userId and t.status = :statusFinished
              GROUP BY d.address
            ORDER BY t.date DESC LIMIT 10;
        ";

        $bind = [
            ':userId' => $userId,
            ':statusFinished' => Trip::FINISHED
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}