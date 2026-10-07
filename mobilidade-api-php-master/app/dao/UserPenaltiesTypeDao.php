<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/01/2019
 * Time: 17:50
 */
class UserPenaltiesTypeDao extends BaseDao
{
    protected $table = 'userPenaltiesType';

    public function find($id)
    {
        return $this->sqlSelect([],
            [['idUserPenaltyType', '=', ':idUserPenaltyType']]
        )
            ->bind([':idUserPenaltyType' => $id])
            ->get(false);
    }
}