<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Driver;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/03/2019
 * Time: 12:03
 */
class UpdateDriverPositionDao extends BaseDao
{
    protected $table = 'driver';

    public function getActiveDrivers()
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} d
              WHERE 
                d.status = :status
              ORDER BY d.appIsOpen DESC
        ";

        $bind = [
            ':status' => Driver::AVAILABLE
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function getActiveLazyDrivers()
    {
        $sql = "
            SELECT
                d.idDriver,
                u.deviceToken
            FROM {$this->table} d
                INNER JOIN user u on d.userId = u.idUser
                INNER JOIN config c ON c.`key` = 'time_to_turn_off_lazy_driver'
              WHERE
                d.status = :status AND
                TIMESTAMPDIFF(MINUTE, d.last_position_update, :now) >= c.value
              ORDER BY d.last_position_update DESC
        ";

        $bind = [
            ':status' => Driver::AVAILABLE,
            ':now' => now()
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $status
     * @param array $arrayIds
     * @return bool
     * @throws Exception
     */
    public function turnStatus($status, array $arrayIds = [])
    {
        return $this->sqlUpdate(
            [
                'status' => ':status'
            ],
            [['idDriver', 'IN', '(' . implode(',', $arrayIds) . ')']],
            [':status' => $status]
        );
    }
}