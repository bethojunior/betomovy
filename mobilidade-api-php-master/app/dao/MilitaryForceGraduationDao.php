<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/12/2019
 * Time: 11:40
 */
class MilitaryForceGraduationDao extends BaseDao
{
    protected $table = "militaryForceGraduation";

    public function findByMilitaryForce($militaryForceId)
    {
        return $this->sqlSelect([], [
            ['militaryForceId', '=', ':militaryForceId']
        ], ['level', 'DESC'])
            ->bind([
                ':militaryForceId' => $militaryForceId
            ])
            ->get();
    }
}