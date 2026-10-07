<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2018
 * Time: 17:45
 */
class VoucherPurchaseDao extends BaseDao
{
    protected $table = 'voucherPurchase';

    public function find($id)
    {
        return $this->sqlSelect([],
            [['idVoucherPurchase', '=', ':idVoucherPurchase']]
        )
            ->bind([':idVoucherPurchase' => $id])
            ->get(false);
    }

    public function findByField($field, $value)
    {
        return $this->sqlSelect(
            [],
            [[$field, '=', ":$field"]]
        )
            ->bind([":$field" => $value])
            ->get(false);
    }
}