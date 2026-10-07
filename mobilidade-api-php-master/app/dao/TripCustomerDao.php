<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/05/2019
 * Time: 16:06
 */
class TripCustomerDao extends BaseDao
{
    protected $table = 'tripCustomer';

    /**
     * @param $id
     * @return array|mixed
     */
    public function find($id)
    {
        return $this->sqlSelect([
            'id', 'name', 'phone', 'created_at', 'name AS nickname', 'email', 'totem'
        ], [
            ['id', '=', ':id']
        ])
            ->bind([':id' => $id])
            ->get(false);
    }
}