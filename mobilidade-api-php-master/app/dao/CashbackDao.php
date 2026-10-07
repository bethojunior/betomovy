<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use app\utils\Connection;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/12/2019
 * Time: 09:29
 */
class CashbackDao extends BaseDao
{
    protected $table = 'cashback';

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findByCoordinateAndTripType($lat, $lng, $tripTypeId)
    {
        $sql = "
            SELECT
                c.*
            FROM {$this->table} c
              INNER JOIN cityArea ca ON c.cityId = ca.cityId
              WHERE
                ca.statusId = 1 AND
                ST_CONTAINS(ca.polygon, ST_GeomFromText('POINT({$lat} {$lng})')) AND
                c.tripTypeId = :tripTypeId AND
                c.active = 1 AND
                c.statusId = 1
            LIMIT 1
        ";

        $bind = [':tripTypeId' => $tripTypeId];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function find($id)
    {
        return $this->sqlSelect([], [
            ['id', '=', ':id']
        ])
            ->bind([':id' => $id])
            ->first();
    }

    public function findActive($id)
    {
        return $this->sqlSelect([], [
            ['id', '=', ':id', 'AND'],
            ['statusId', '=', ':statusId']
        ])
            ->bind([
                ':id' => $id,
                ':statusId' => Status::ATIVO,
            ])
            ->first();
    }
}