<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/10/2019
 * Time: 13:49
 */
class PaymentFormTypeDao extends BaseDao
{
    protected $table = 'paymentFormType';

    public function getAll()
    {
        return $this->sqlSelect()
            ->get();
    }
}