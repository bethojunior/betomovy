<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/12/2019
 * Time: 13:03
 */
class RouteDriverAcceptedDao extends BaseDao
{
    protected $table = 'routeDriverAccepted';

    public function findByRouteAndDriver($routeId, $driverId)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} rda
              WHERE 
                rda.statusId = :status AND
                rda.driverId = :driverId AND
                rda.routeId = :routeId
              LIMIT 1
        ";

        $bind = [
            ':driverId' => $driverId,
            ':routeId' => $routeId,
            ':status' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findByDriver($driverId, $active = false)
    {
        $sql = "
            SELECT
                rda.*
            FROM {$this->table} rda
              INNER JOIN route r ON rda.routeId = r.id
              WHERE
                rda.statusId = :status AND
                rda.driverId = :driverId AND
                r.statusId = :status AND 
                r.active = :active
                
        ";

        $bind = [
            ':driverId' => $driverId,
            ':active' => true,
            ':status' => Status::ATIVO,
        ];

        if ($active) {
            $sql .= " AND rda.active = :active";
            $bind += [':active' => $active];
        }

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}