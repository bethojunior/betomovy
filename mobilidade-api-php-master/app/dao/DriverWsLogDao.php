<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;
use app\model\Log;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/03/2019
 * Time: 12:05
 */
class DriverWsLogDao extends BaseDao
{
    /**
     * @param Log $log
     * @return bool
     */
    public function insert(Log $log)
    {
        return $this->noSqlInsert($log->toStdClass());
    }
}
