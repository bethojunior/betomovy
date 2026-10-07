<?php

namespace app\dao;

use app\utils\BaseDao;

class ManagmentWppGroupNotificationDao extends BaseDao
{
    protected $table = 'managment_wpp_group_notifications';

    public function findActiveByReference(string $reference): ?object
    {
        return $this->sqlRawSelect(
            "SELECT * FROM {$this->table} WHERE reference = :reference LIMIT 1",
            [':reference' => $reference]
        )->get(false);
    }

    public function findBestMatchByReference(string $reference, $cityId, $tripTypeId): ?object
    {
        $sql = "
            SELECT
                *,
                (
                    IF(cityId IS NOT NULL AND cityId = :cityId, 2, 0) +
                    IF(tripTypeId IS NOT NULL AND tripTypeId = :tripTypeId, 1, 0)
                ) AS matchScore
            FROM {$this->table}
            WHERE
                reference = :reference
                AND status = 1
                AND (cityId IS NULL OR cityId = :cityId)
                AND (tripTypeId IS NULL OR tripTypeId = :tripTypeId)
            ORDER BY matchScore DESC, id ASC
            LIMIT 1
        ";

        return $this->sqlRawSelect($sql, [
            ':reference' => $reference,
            ':cityId' => $cityId,
            ':tripTypeId' => $tripTypeId,
        ])->get(false);
    }
}
