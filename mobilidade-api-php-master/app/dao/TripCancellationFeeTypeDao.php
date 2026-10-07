<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/05/2019
 * Time: 11:23
 */
class TripCancellationFeeTypeDao extends BaseDao
{
    protected $table = 'tripCancellationFeeType';

    public function find($id)
    {
        return $this->sqlSelect([], [
            ['id', '=', ':id']
        ])
            ->bind([
                ':id' => $id
            ])
            ->get(false);
    }
}