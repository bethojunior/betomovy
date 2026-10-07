<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/09/2018
 * Time: 14:22
 */
class DriverStationDao extends BaseDao
{
    protected $table = "driverStation";

    public function findActive($driverId, $stationId)
    {
        return $this->sqlSelect(
            [],
            [
                ['driverId', '=', ':driverId', 'AND'],
                ['stationId', '=', ':stationId', 'AND'],
                ['statusId', '=', ':statusId']
            ]
        )
            ->bind([
                ':driverId' => $driverId,
                ':stationId' => $stationId,
                ':statusId' => Status::ATIVO
            ])
            ->get(false);
    }

    /**
     * @param $driverId
     * @param $stationId
     * @return bool
     * @throws Exception
     */
    public function delete($driverId, $stationId)
    {
        return $this->sqlUpdate(
            ['statusId' => ':statusId'],
            [
                ['driverId', '=', ':driverId', 'AND'],
                ['stationId', '=', ':stationId', 'AND'],
                ['statusId', '=', ':statusActiveId']
            ],
            [
                ':driverId' => $driverId,
                ':stationId' => $stationId,
                ':statusId' => Status::EXCLUIDO,
                ':statusActiveId' => Status::ATIVO
            ]
        );
    }
}