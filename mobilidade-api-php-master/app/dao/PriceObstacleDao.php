<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/09/2019
 * Time: 17:35
 */
class PriceObstacleDao extends BaseDao
{
    protected $table = 'priceObstacle';

    public function findByCity($cityId)
    {
        $sql = "
            SELECT
                oof.description AS obstacle,
                oof.picture,
                po.*
            FROM {$this->table} po
              INNER JOIN obstacleOnFloor oof ON 
                (oof.id = po.obstacleOnFloorId AND oof.statusId = :status)
              WHERE
                po.statusId = :status AND
                po.cityId = :cityId
        ";

        return $this->sqlRawSelect($sql, [
            ':status' => Status::ATIVO,
            ':cityId' => $cityId,
        ])
            ->get();
    }
}