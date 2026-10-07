<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 17:34
 */
class DeliveryInfoDao extends BaseDao
{
    protected $table = 'deliveryInfo';

    public function findByTripReference($tripReference)
    {
        return $this->sqlSelect([],
            [['tripReference', '=', ':tripReference']], '', 1)
            ->bind([':tripReference' => $tripReference])
            ->get(false);
    }
}