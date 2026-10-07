<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/07/2019
 * Time: 17:24
 */
class CompanyDao extends BaseDao
{
    public function findByField($field, $value)
    {
        return $this->sqlSelect([], [
            [$field, '=', ':field', 'AND'],
            ['statusId', '=', ':statusId']
        ], [], 1)
            ->bind([':field' => $value, ':statusId' => Status::ATIVO])
            ->get(false);
    }
}