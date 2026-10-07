<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 15:28
 */
class GenderDao extends BaseDao
{
    protected $table = 'gender';

    public function find($id)
    {
        return $this->sqlSelect([],
            [
                ['id', '=', ':id']
            ]
        )
            ->bind([':id' => $id])
            ->get(false);
    }
}