<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/12/2018
 * Time: 16:28
 */
class TripCardPaymentDao extends BaseDao
{
    protected $table = "tripCardPayment";

    public function findByTrip($tripReference)
    {
        $tripCardPayment = $this->sqlSelect([],
            [['tripReference', '=', ':tripReference']],
            ['created_at', 'DESC']
        )
            ->bind([':tripReference' => $tripReference])
            ->first();

        return $tripCardPayment;
    }

    public function findByTransaction($transactionId)
    {
        return $this->sqlSelect([],
            [['transactionId', '=', ':transactionId']],
            ['created_at', 'ASC']
        )
            ->bind([':transactionId' => $transactionId])
            ->get(false);
    }
}