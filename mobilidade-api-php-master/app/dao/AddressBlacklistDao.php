<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/06/2020
 * Time: 09:48
 */
class AddressBlacklistDao extends BaseDao
{
    protected $table = 'addressBlacklist';

    public function findByAddress(string $address)
    {
        return $this->sqlSelect([], [
            ['address', 'LIKE', ':address', 'AND'],
            ['deleted_at', 'IS', 'NULL']
        ])
            ->bind([':address' => $address])
            ->first();
    }
}