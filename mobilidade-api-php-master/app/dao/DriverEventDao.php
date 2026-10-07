<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;
use Exception;

class DriverEventDao extends BaseDao
{

    /**
     * @param $tripReference
     * @param $event
     * @return mixed
     * @throws Exception
     */
    public function getTripEvent($tripReference, $event)
    {
        return $this->noSqlSelect(
            [
                'message' => $event,
                'idReference' => $tripReference
            ],
            [
                'projection' => [
                    '_id' => 0,
                    'data' => 1
                ]
            ]
        )[0] ?? [];
    }
}
