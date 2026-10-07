<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Origin;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/02/2019
 * Time: 10:28
 */
class DriverCommissionDao extends BaseDao
{
    protected $table = 'driverCommission';

    public function find($driverCommissionId)
    {
        return $this->sqlSelect([], [
            ['idDriverCommission', '=', ':driverCommissionId']
        ])
            ->bind([':driverCommissionId' => $driverCommissionId])
            ->get(false);
    }

    public function findByCityAndTripType($cityId, $tripTypeId)
    {
        return $this->sqlSelect([],
            [
                ['cityId', '=', ':cityId', 'AND'],
                ['tripTypeId', '=', ':tripTypeId', 'AND'],
                ['statusId', '=', ':statusId'],
            ],
            ['created_at', 'DESC'],
            1
        )
            ->bind([
                ':cityId' => $cityId,
                ':tripTypeId' => $tripTypeId,
                ':statusId' => Status::ATIVO,
            ])
            ->first();
    }

    public function findByOriginAndTripType(Origin $origin, $tripTypeId)
    {
        $sql = "
            SELECT
                dc.*
            FROM driverCommission dc
                INNER JOIN cityArea cA ON cA.cityId = dc.cityId
                WHERE
                  cA.statusId = 1 AND
                  dc.statusId = 1 AND
                  dc.tripTypeId = :tripTypeId AND
                  ST_Contains(
                      cA.polygon,
                      ST_GEOMFROMTEXT(
                          CONCAT('POINT(', :lat, ' ', :lng, ')'))) = 1
                LIMIT 1
        ";

        $bind = [
            ':tripTypeId' => $tripTypeId,
            ':lat' => $origin->getLatitude(),
            ':lng' => $origin->getLongitude(),
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findFirstByTripType(int $tripTypeId)
    {
        return $this->sqlSelect([],
            [
                ['tripTypeId', '=', ':tripTypeId', 'AND'],
                ['statusId', '=', ':statusId'],
            ]
        )
            ->bind([
                ':tripTypeId' => $tripTypeId,
                ':statusId' => Status::ATIVO,
            ])
            ->first();
    }
}