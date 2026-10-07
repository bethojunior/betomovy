<?php


namespace app\dao;

use app\utils\BaseDao;

class FreightInfoDao extends BaseDao
{
    protected $table = 'freightInfo';

    public function findByTripReference($tripReference)
    {
        return $this->sqlSelect([],
            [['tripReference', '=', ':tripReference']], '', 1)
            ->bind([':tripReference' => $tripReference])
            ->get(false);
    }
}