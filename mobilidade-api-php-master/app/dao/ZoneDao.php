<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Origin;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 25/07/2018
 * Time: 13:23
 */
class ZoneDao extends BaseDao
{
    public function getDefaultZones()
    {
        return $this->sqlRawSelect("
            SELECT
                idZone,
                radius,
                time
            FROM {$this->table}
              WHERE cityId IS NULL
              ORDER BY idZone ASC
        ")
            ->get();
    }

    public function find($id)
    {
        return $this->sqlSelect([],
            [
                ['idZone', '=', ':zoneId'],
            ]
        )
            ->bind([
                ':zoneId' => $id
            ])
            ->get(false);
    }

    public function findFirstFromCity($cityId)
    {
        return $this->sqlSelect([],
            [
                ['cityId', '=', ':cityId', 'AND'],
                [$this->table . '.order', '=', ':orderFirst', 'AND'],
                ['statusId', '=', ':statusId'],
            ],
            [], 1
        )
            ->bind([
                ':cityId' => $cityId,
                ':orderFirst' => 1,
                ':statusId' => Status::ATIVO,
            ])
            ->get(false);
    }

    public function findByCityToIncreaseArea($cityId, $time)
    {
        return $this->sqlSelect([],
            [
                ['cityId', '=', ':cityId', 'AND'],
                ['time', '>', ':time', 'AND'],
                ['statusId', '=', ':statusId'],
            ],
            ['time', 'ASC'],
            1
        )
            ->bind([
                ':cityId' => $cityId,
                ':time' => $time,
                ':statusId' => Status::ATIVO,
            ])
            ->get(false);
    }

    public function findFromOrigin(Origin $origin)
    {
        $sql = "
            SELECT
                z.*
            FROM zone z
              INNER JOIN (
                SELECT
                    ca.*
                FROM cityArea ca
                    WHERE
                        ca.statusId = :statusId AND
                        ST_Contains(
                            ca.polygon,
                            ST_GEOMFROMTEXT(
                                CONCAT('POINT(',:lat,' ',:lng, ')')
                            )
                        )
                LIMIT 1
              ) as cA ON cA.cityId = z.cityId
              WHERE z.statusId = :statusId
              LIMIT 1
        ";

        $bind = [
            ':lat' => $origin->getLatitude(),
            ':lng' => $origin->getLongitude(),
            ':statusId' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}