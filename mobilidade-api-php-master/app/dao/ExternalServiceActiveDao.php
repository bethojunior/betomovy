<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/03/2020
 * Time: 12:04
 */
class ExternalServiceActiveDao extends BaseDao
{
    protected $table = 'externalServiceActive';

    public function findActiveByAction(int $externalServiceActionId)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} es
                WHERE es.externalServiceActionId = :externalServiceActionId
        ";

        $bind = [':externalServiceActionId' => $externalServiceActionId];

        return $this->sqlRawSelect($sql, $bind)
            ->first();
    }
}