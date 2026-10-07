<?php

namespace app\dao;

use app\utils\BaseDao;

class CentralDao extends BaseDao
{
    protected $table = 'central';

    public function find($id)
    {
        $sql = "
            SELECT
                cc.balanceId
            FROM central cc
              WHERE cc.responsibleId = :id
        ";

        $bind = ['id' => $id];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

}