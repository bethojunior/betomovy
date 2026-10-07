<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use app\utils\Connection;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/10/2019
 * Time: 17:24
 */
class PriceRangeDao extends BaseDao
{
    protected $table = "priceRange";

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findNewPriceByCityAndTripType($cityId, $tripTypeId, $value)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} pr
              WHERE 
                pr.statusId = :status AND
                pr.cityId = :cityId AND
                pr.tripTypeId = :tripTypeId AND
                :value BETWEEN pr.min_value AND pr.max_value
            LIMIT 1
        ";

        $bind = [
            ':status' => Status::ATIVO,
            ':cityId' => $cityId,
            ':tripTypeId' => $tripTypeId,
            ':value' => $value,
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