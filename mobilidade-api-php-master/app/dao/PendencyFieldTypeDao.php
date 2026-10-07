<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/01/2020
 * Time: 09:40
 */
class PendencyFieldTypeDao extends BaseDao
{
    protected $table = 'pendencyFieldType';

    public function findInitPending()
    {
        return $this->sqlSelect([], [
            ['initPending', '=', ':initPending']
        ])
            ->bind([':initPending' => true])
            ->get();
    }
}