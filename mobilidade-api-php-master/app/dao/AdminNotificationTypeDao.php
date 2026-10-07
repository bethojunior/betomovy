<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/11/2019
 * Time: 17:46
 */
class AdminNotificationTypeDao extends BaseDao
{
    protected $table = 'adminNotificationType';

    public function find($id)
    {
        return $this->sqlSelect(
            [], [['id', '=', ':id']]
        )
            ->bind([':id' => $id])
            ->get(false);
    }
}