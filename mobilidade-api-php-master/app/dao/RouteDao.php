<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/12/2019
 * Time: 09:42
 */
class RouteDao extends BaseDao
{
    public function findByCoordinate($lat, $lng, ?int $driverUserId = null)
    {
        $driverQuery = "";
        $bind = [
            ':statusId' => Status::ATIVO,
            ':active' => true,
        ];

        if ($driverUserId) {
            $driverQuery = " AND r.id NOT IN (
                SELECT routeDriverAccepted.routeId FROM routeDriverAccepted
                    INNER JOIN driver ON routeDriverAccepted.driverId = driver.idDriver
                    WHERE 
                        driver.userId = :driverUserId AND
                        routeDriverAccepted.statusId = 1 AND
                        routeDriverAccepted.active = 1
            )";

            $bind += [
                ':driverUserId' => $driverUserId,
            ];
        }

        $sql = /** @lang sql */ "
            SELECT
                r.*
            FROM $this->table r
              INNER JOIN cityArea ca ON r.cityId = ca.cityId
              WHERE 
                r.statusId = :statusId AND
                r.active = :active AND
                ST_CONTAINS(ca.polygon, ST_GeomFromText('POINT({$lat} {$lng})')) AND 
                ca.statusId = :statusId
                $driverQuery
              ORDER BY r.created_at
        ";

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function find($id, $withTrash = false)
    {
        $where = $withTrash ? '' : 'r.statusId = :statusId AND';

        $sql = "
            SELECT
                r.*
            FROM {$this->table} r
              INNER JOIN cityArea ca ON r.cityId = ca.cityId
              WHERE 
                {$where}
                r.active = :active AND 
                ca.statusId = :statusId AND 
                r.id = :id
              LIMIT 1
        ";

        $bind = [
            ':statusId' => Status::ATIVO,
            ':active' => true,
            ':id' => $id,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    function findByCorporateRouteId($corporateRouteId)
    {
        $sql = "
            SELECT
                r.*
            FROM {$this->table} r
              INNER JOIN cityArea ca ON r.cityId = ca.cityId
              INNER JOIN corporateRoute cR ON r.id = cR.routeId
              WHERE 
                r.statusId = :statusId AND
                r.active = :active AND 
                ca.statusId = :statusId AND 
                cR.id = :id
              LIMIT 1
        ";

        $bind = [
            ':statusId' => Status::ATIVO,
            ':active' => true,
            ':id' => $corporateRouteId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}