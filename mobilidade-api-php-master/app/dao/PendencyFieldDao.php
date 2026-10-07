<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 18:41
 */
class PendencyFieldDao extends BaseDao
{
    protected $table = 'pendencyField';

    public function findByUser($userId)
    {
        $sql = "
            SELECT
                pf.userId,
                pfs.name AS pendencyFieldStatus,
                pft.name AS namePendencyFieldType,
                pft.fieldType,
                pft.description,
                pf.pendencyFieldStatusId,
                pf.pendencyFieldTypeId
            FROM {$this->table} pf
              INNER JOIN pendencyFieldStatus pfs ON pfs.id = pf.pendencyFieldStatusId
              INNER JOIN pendencyFieldType pft ON pft.id = pf.pendencyFieldTypeId
              WHERE 
                pf.userId = :userId AND pf.statusId = :statusId
        ";

        $bind = [
            ':userId' => $userId,
            ':statusId' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $userId
     * @param $pendencyFieldTypeId
     * @param $pendencyFieldStatusId
     * @return bool
     * @throws Exception
     */
    public function updateStatusFieldByUser($userId, $pendencyFieldTypeId, $pendencyFieldStatusId)
    {
        return $this->sqlUpdate([
            'pendencyFieldStatusId' => ':pendencyFieldStatusId',
        ], [
            ['userId', '=', ':userId', 'AND'],
            ['pendencyFieldTypeId', '=', ':pendencyFieldTypeId']
        ], [
            ':pendencyFieldStatusId' => $pendencyFieldStatusId,
            ':userId' => $userId,
            ':pendencyFieldTypeId' => $pendencyFieldTypeId
        ]);
    }
}