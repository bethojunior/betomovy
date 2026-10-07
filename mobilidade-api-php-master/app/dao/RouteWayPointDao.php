<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/12/2019
 * Time: 11:59
 */
class RouteWayPointDao extends BaseDao
{
    protected $table = "routeWayPoint";

    public function findByRoute($routeId)
    {
        $sql = "
            SELECT
                rwp.id,
                rwp.routeId,
                rwp.routePitStopId,
                rwp.routePitStopTypeId,
                rpst.name AS routePitStopType,
                rps.tag,
                rps.complement,
                rps.latitude,
                rps.longitude,
                rps.address
            FROM {$this->table} rwp
              INNER JOIN routePitStopType rpst ON rpst.id = rwp.routePitStopTypeId
              INNER JOIN routePitStop rps ON rps.id = rwp.routePitStopId
              WHERE 
                rwp.routeId = :routeId AND rwp.statusId = :statusId
             ORDER BY rwp.id
        ";

        $bind = [
            ':routeId' => $routeId,
            ':statusId' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function findByRouteAndRoutePitStopType($routeId, $routePitStopTypeId)
    {
        $sql = "
            SELECT
                rwp.id,
                rwp.routeId,
                rwp.routePitStopId,
                rwp.routePitStopTypeId,
                rpst.name AS routePitStopType,
                rps.tag,
                rps.complement,
                rps.latitude,
                rps.longitude,
                rps.address
            FROM {$this->table} rwp
              INNER JOIN routePitStopType rpst ON rpst.id = rwp.routePitStopTypeId
              INNER JOIN routePitStop rps ON rps.id = rwp.routePitStopId
              WHERE 
                rwp.routeId = :routeId AND
                rwp.routePitStopTypeId = :routePitStopTypeId AND 
                rwp.statusId = :statusId
        ";

        $bind = [
            ':routeId' => $routeId,
            ':routePitStopTypeId' => $routePitStopTypeId,
            ':statusId' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}