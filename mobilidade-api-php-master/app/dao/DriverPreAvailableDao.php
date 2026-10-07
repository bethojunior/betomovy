<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/02/2019
 * Time: 16:56
 */
class DriverPreAvailableDao extends BaseDao
{
    protected $table = 'driver';

    /**
     * @param $userId
     * @param bool $preAvailable
     * @return bool
     * @throws Exception
     */
    public function updatePreAvailable($userId, bool $preAvailable = true): bool
    {
        return $this->sqlUpdate(
            ['preAvailable' => ':preAvailable'],
            [['userId', '=', ':userId']],
            [':preAvailable' => $preAvailable, ':userId' => $userId]
        );
    }
}