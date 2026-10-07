<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/06/2019
 * Time: 16:29
 */
class DriverRegisterStatusDao extends BaseDao
{
    protected $table = 'driverRegisterStatus';

    public function find($id)
    {
        return $this->sqlSelect(
            [],
            [['idDriverRegisterStatus', '=', ':idDriverRegisterStatus']])
            ->bind([':idDriverRegisterStatus' => $id])
            ->get(false);
    }
}