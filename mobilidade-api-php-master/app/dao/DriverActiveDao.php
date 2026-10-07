<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Driver;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2020
 * Time: 15:26
 */
class DriverActiveDao extends BaseDao
{
    protected $table = 'driver';

    public function findAllActives()
    {
        $sql = "
            SELECT
                d.idDriver,
                u.idUser,
                u.name,
                d.last_lat AS latitude,
                d.last_lon AS longitude,
                u.deviceToken
            FROM {$this->table} d
                INNER JOIN user u ON d.userId = u.idUser
                WHERE
                    d.status = :availableStatus
        ";

        $bind = [':availableStatus' => Driver::AVAILABLE];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}