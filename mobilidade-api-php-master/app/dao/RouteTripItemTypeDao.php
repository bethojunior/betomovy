<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/12/2019
 * Time: 12:12
 */
class RouteTripItemTypeDao extends BaseDao
{
    protected $table = "routeTripItemType";

    public function findByRoute($routeId)
    {
        $sql = "
            SELECT
                rtit.id,
                rtit.tripItemTypeId,
                rtit.value,
                tit.name,
                CONCAT(c.value, 'tripItemType/', tit.picture) AS picture
            FROM {$this->table} rtit
              INNER JOIN tripItemType tit ON tit.id = rtit.tripItemTypeId
              INNER JOIN config c ON c.`key` = 'link_storage_pictures'
              WHERE 
                rtit.statusId = :status AND
                rtit.routeId = :routeId
        ";

        $bind = [
            ':status' => Status::ATIVO,
            ':routeId' => $routeId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}