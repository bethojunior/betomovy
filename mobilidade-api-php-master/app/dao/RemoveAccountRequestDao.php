<?php

namespace app\dao;

use app\utils\BaseDao;

class RemoveAccountRequestDao extends BaseDao
{
    public $table = 'removeAccountRequest';

    public function find($idUser)
    {
        $bind[':userId'] = $idUser;

        $sql = /** @lang sql */
            "
            SELECT
                id,
                userId,
                userIdWhoDeleted,
                cityId,
                type,
                reason,
                details,
                ip,
                platform,
                created_at
            FROM {$this->table}
            WHERE userId = :userId AND deleted_at IS NULL
        ";

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

}