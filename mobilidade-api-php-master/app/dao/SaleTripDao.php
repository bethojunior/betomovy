<?php

namespace app\dao;

use app\utils\BaseDao;

class SaleTripDao extends BaseDao
{
    public function getAll()
    {
        $query = "SELECT * FROM saleTrip WHERE deleted_at IS NULL ORDER BY id ASC";

        return $this->sqlRawSelect($query)->get(false);
    }

    public function findByCity($cityId)
    {
        $sql = "SELECT *
                FROM saleTrip
                WHERE cityId = :cityId
                  AND status = :status
                  AND deleted_at IS NULL 
                  AND now() between startDay and endDay                  
                 LIMIT 1";

        return $this->sqlRawSelect($sql, [
            ':cityId' => $cityId,
            ':status' => true
        ])->get(false);
    }
}