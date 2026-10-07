<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Origin;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/02/2019
 * Time: 09:20
 */
class CityCallConfigDao extends BaseDao
{
    protected $table = 'cityCallConfig';

    public function findAll($cityId)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} cc
              WHERE 
                cc.cityId = :cityId AND
                cc.statusId = :statusId
            ORDER BY cc.seq ASC
        ";

        $bind = [
            ':cityId' => $cityId,
            ':statusId' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function findByCityArea(Origin $origin)
    {
        $sql = "
            SELECT
                cc.*
            FROM cityCallConfig cc
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
              ) as cA ON cA.cityId = cc.cityId
              WHERE
                cc.statusId = :statusId
            ORDER BY cc.seq
        ";

        $bind = [
            ':lat' => $origin->getLatitude(),
            ':lng' => $origin->getLongitude(),
            ':statusId' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}