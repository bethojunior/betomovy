<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/09/2019
 * Time: 17:04
 */
class AccessibilityObstacleDao extends BaseDao
{
    protected $table = 'accessibilityObstacle';

    public function findByTripReference($tripReference)
    {
        $sql = "
            SELECT
                ao.accessibilityId,
                ao.obstacleOnFloorId,
                ao.actionId,
                o.description,
                o.picture,
                po.value,
                aa.name AS action
            FROM {$this->table} ao
              INNER JOIN accessibility a ON a.id = ao.accessibilityId
              INNER JOIN trip t on a.tripReference = t.tripReference
              INNER JOIN accessibilityAction aa ON aa.id = ao.actionId
              INNER JOIN obstacleOnFloor o ON
                (o.id = ao.obstacleOnFloorId AND o.statusId = :status)
              INNER JOIN priceObstacle po ON
                (
                    ao.obstacleOnFloorId = po.obstacleOnFloorId AND
                    po.statusId = :status AND
                    po.cityId = t.cityId
                )
            WHERE
              a.tripReference = :tripReference
        ";

        $bind = [
            ':tripReference' => $tripReference,
            ':status' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}