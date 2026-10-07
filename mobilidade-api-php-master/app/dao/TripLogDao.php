<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;
use Exception;

/**
 * Created by PhpStorm.
 * Date: 10/09/2018
 * Time: 14:23
 */
class TripLogDao extends BaseDao
{

    /**
     * @param $tripReference
     * @return array
     * @throws Exception
     */
    public function findLogsWithDriver($tripReference)
    {
        $logs = $this->noSqlSelect(
            [
                'idReference' => $tripReference,
                'data.driverId' => [
                    '$ne' => null
                ],
                'data.idTrip' => [
                    '$ne' => null
                ]
            ],
            [
                'projection' => [
                    '_id' => 0,
                    'logType' => 0,
                    'idLog' => 0
                ],
                'sort' => [
                    'date' => 1
                ]
            ]
        );

        return $logs;
    }
}
