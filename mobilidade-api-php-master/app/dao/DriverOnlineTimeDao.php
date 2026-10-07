<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2019
 * Time: 14:49
 */
class DriverOnlineTimeDao extends BaseDao
{
    protected $table = 'driverOnlineTime';

    public function findActive($idDriver)
    {
        return $this->sqlSelect([],
            [
                ['driverId', '=', ':driverId', 'AND'],
                ['statusId', '=', ':status', 'AND'],
                ['time_out', 'IS', 'NULL']
            ]
        )
            ->bind([
                ':driverId' => $idDriver,
                ':status' => Status::ATIVO,
            ])
            ->get(false);
    }

    /**
     * @param $driverOnlineTimeId
     * @return bool
     * @throws Exception
     */
    public function turnOff($driverOnlineTimeId)
    {
        return $this->sqlUpdate(
            [
                'time_out' => ':time_out',
                'statusId' => ':status',
            ],
            [
                ['idDriverOnlineTime', '=', ':idDriverOnlineTime'],
            ],
            [
                ':time_out' => now(),
                ':status' => Status::EXCLUIDO,
                ':idDriverOnlineTime' => $driverOnlineTimeId,
            ]
        );
    }
}