<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;
use app\model\Log;
use app\model\LogCriticalType;

/**
 * Created by PhpStorm.
 * Date: 22/02/2019
 * Time: 14:05
 */
class LogDriverDao extends BaseDao
{

    public function insert($request)
    {
        $log = new Log(null, LogCriticalType::INFORMACAO, $request);

        $this->noSqlInsert($log->toStdClass());

        return $log->toStdClass();
    }

    public function insertMany($request)
    {
        $request = array_map(function ($log) {
            $log = new Log(null, LogCriticalType::INFORMACAO, $log);
            return $log->toStdClass();
        }, $request);

        $this->noSqlInsertMany($request);

        return true;
    }
}
