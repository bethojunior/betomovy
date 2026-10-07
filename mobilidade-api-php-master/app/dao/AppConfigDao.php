<?php

namespace app\dao;

use app\utils\BaseDao;

class AppConfigDao extends BaseDao
{
    public function findByApp($appId)
    {
        return $this->sqlRawSelect("SELECT * FROM appConfig WHERE appId = :appId AND deleted_at IS NULL",
            [":appId" => $appId])->get(false);
    }
}