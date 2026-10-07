<?php

namespace app\dao;

use app\utils\BaseDao;

class IntegrationPartnersDao extends BaseDao
{
    protected $table = 'integration_partners';

    public function findAllPartners()
    {
        $sql = "
        SELECT *
        FROM {$this->table}
        WHERE deleted_at IS NULL
        ";

        return $this->sqlRawSelect($sql)->get();
    }
}
