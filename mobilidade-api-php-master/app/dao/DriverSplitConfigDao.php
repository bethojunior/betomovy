<?php

namespace app\dao;

use app\utils\BaseDao;

class DriverSplitConfigDao extends BaseDao
{
    protected $table = 'driverSplitConfig';

    public function findActiveByDriver(int $driverId): ?\stdClass
    {
        $sql = /** @lang sql */ "
            SELECT
                id,
                driverId,
                financialIntermediaryId,
                externalId,
                status,
                created_at,
                updated_at
            FROM
                driverSplitConfig
            WHERE
                driverId = :driverId AND
                deleted_at IS NULL
        ";

        $params = [':driverId' => $driverId];

        $result = $this->sqlRawSelect($sql, $params)
            ->first();

        if (!$result) {
            return null;
        }

        return $result;
    }
}