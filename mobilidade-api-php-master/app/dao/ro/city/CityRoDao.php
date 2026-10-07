<?php

namespace app\dao\ro\city;

use app\utils\BaseDao;
use app\utils\Connection;

class CityRoDao extends BaseDao
{
    protected $table = 'city';

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findByCoordinate($latitude, $longitude)
    {
        $sql = /** @lang sql */ "
            SELECT
                c.*
            FROM {$this->table} c
              INNER JOIN cityArea ca ON c.id = ca.cityId
              WHERE
                ca.statusId = 1 AND
                ST_CONTAINS(ca.polygon, ST_GeomFromText('POINT({$latitude} {$longitude})'))
            LIMIT 1
        ";

        return $this->sqlRawSelect($sql)
            ->get(false);
    }
}