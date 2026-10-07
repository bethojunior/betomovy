<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;

// Read-only class
class DynamicAreaDao extends BaseDao
{
    protected $table = "dynamicArea";

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findByPosition($lat, $lng, $time)
    {
        $sql = "select *
            from dynamicArea
            where ST_Contains(
                    area,
                    ST_GEOMFROMTEXT(
                            CONCAT('POINT({$lat} {$lng})')
                        )
                )
              and active is true
              and deleted_at is null
              and :timeCurrent >= startTime and endTime >= :timeCurrent
              ";

        return $this->sqlRawSelect($sql, [":timeCurrent" => $time])->first();
    }

    public function findAllByPosition($lat, $lng, $time)
    {
        $sql = "select dA.*,
                       ST_AsText(dA.area) AS area
                from cityArea
                         inner join dynamicArea dA on cityArea.cityId = dA.cityId
                where ST_Contains(
                        polygon,
                        ST_GEOMFROMTEXT(
                                CONCAT('POINT({$lat} {$lng})')
                            )
                    )
                  and statusId = 1
                  and active is true
                  and deleted_at is null
                  and :timeCurrent >= startTime and endTime >= :timeCurrent
                  ";

        return $this->sqlRawSelect($sql, [":timeCurrent" => $time])->get();
    }
}