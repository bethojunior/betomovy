<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/01/2019
 * Time: 16:58
 */
class UserBonusRatingTypeDao extends BaseDao
{
    protected $table = "userBonusRatingType";

    public function find($id)
    {
        return $this->sqlSelect([],
            [['idUserBonusRatingType', '=', ':idUserBonusRatingType']]
        )
            ->bind([':idUserBonusRatingType' => $id])
            ->get(false);
    }
}