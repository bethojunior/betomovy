<?php

namespace app\dao;

use app\utils\BaseDao;

class CallGroupDao extends BaseDao
{
    protected $table = "call_group";

    public function getCallsGroups()
    {
        $sql = "SELECT * FROM {$this->table};";

        $responseCallGroup = $this->sqlRawSelect($sql, [])->get(false);

        return $responseCallGroup;
    }
}
