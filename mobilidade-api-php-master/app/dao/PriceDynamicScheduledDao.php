<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/04/2019
 * Time: 17:35
 */
class PriceDynamicScheduledDao extends BaseDao
{
    protected $table = "priceDynamicScheduled";

    public function findActiveInCity($cityId, $tripTypeId, $date = null)
    {
        $date = $date ?? now();

        $sql = "
            SELECT
              *
            FROM {$this->table} pds
                WHERE
                    pds.statusId = :statusActive AND
                    pds.cityId = :cityId AND
                    pds.tripTypeId = :tripTypeId AND
                    :date BETWEEN pds.startDate AND pds.endDate
                      ORDER BY pds.startDate DESC
                        LIMIT 1
        ";

        $bind = [
            ':statusActive' => Status::ATIVO,
            ':cityId' => $cityId,
            ':tripTypeId' => $tripTypeId,
            ':date' => $date,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}