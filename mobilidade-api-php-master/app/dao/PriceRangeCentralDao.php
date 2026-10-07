<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
class PriceRangeCentralDao extends BaseDao
{
    protected $table = "priceRangeCentral";

    public function findNewPriceByCityAndTripTypeAndCentral($cityId, $tripTypeId, $value, $centralId)
    {
        $sql = "
            SELECT *
            FROM {$this->table} prc
            INNER JOIN priceRangeWithCentral pRWC ON prc.id = pRWC.priceRangeCentralId
            WHERE 
                prc.statusId = :status AND
                prc.cityId = :cityId AND
                prc.tripTypeId = :tripTypeId AND
                :value BETWEEN prc.min_value AND prc.max_value AND
                pRWC.centralId = :centralId
            LIMIT 1
        ";

        $bind = [
            ':status' => Status::ATIVO,
            ':cityId' => $cityId,
            ':tripTypeId' => $tripTypeId,
            ':value' => $value,
            ':centralId' => $centralId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }


    public function findByCityAndTripTypeAndNewPrice($cityId, $tripTypeId, $value)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} pr
              WHERE 
                pr.statusId = :status AND
                pr.cityId = :cityId AND
                pr.tripTypeId = :tripTypeId AND
                pr.new_value = :new_value
            LIMIT 1
        ";

        $bind = [
            ':status' => Status::ATIVO,
            ':cityId' => $cityId,
            ':tripTypeId' => $tripTypeId,
            ':new_value' => $value,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function find($id)
    {
        return $this->sqlSelect([], [
            ['id', '=', ':id']
        ])
            ->bind([
                ':id' => $id
            ])
            ->get(false);
    }
}