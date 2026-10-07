<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/12/2019
 * Time: 14:40
 */
class TripCashbackDao extends BaseDao
{
    protected $table = 'tripCashback';

    public function findByTrip($tripReference)
    {
        return $this->sqlSelect([], [
            ['tripReference', '=', ':tripReference']
        ], [], 1)
            ->bind([':tripReference' => $tripReference])
            ->get(false);
    }
}