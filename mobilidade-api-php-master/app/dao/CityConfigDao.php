<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 19:17
 */
class CityConfigDao extends BaseDao
{
    protected $table = "cityConfig";

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function getByCity($cityId)
    {
        return $this->sqlSelect(['*'],
            [['cityId', '=', ':cityId']]
        )
            ->bind([':cityId' => $cityId])
            ->get(false);
    }

    public function getByCoordinate($lat, $lng)
    {
        $sql =
            /** @lang sql */
            "
            SELECT
              cc.*
            FROM {$this->table} cc
              INNER JOIN cityArea ca ON cc.cityId = ca.cityId
              WHERE
                ca.statusId = 1 AND
                ST_CONTAINS(ca.polygon, ST_GeomFromText('POINT({$lat} {$lng})'))
              LIMIT 1;
        ";

        return $this->sqlRawSelect($sql)
            ->get(false);
    }
}