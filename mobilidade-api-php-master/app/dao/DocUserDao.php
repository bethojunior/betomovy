<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2020
 * Time: 11:18
 */
class DocUserDao extends BaseDao
{
    protected $table = 'docUser';

    public function findByUser($userId)
    {
        $sql = "
            SELECT
                du.docId,
                du.text,
                CONCAT(
                    c.value,
                    'user/',
                    du.userId,
                    '/docs/',
                    du.image
                ) AS image,
                du.docStatusId,
                ds.name AS docStatus,
                doc.label,
                doc.link,
                doc.description,
                doc.deleted_at
            FROM {$this->table} du
                INNER JOIN doc ON doc.id = du.docId
                INNER JOIN docStatus ds ON du.docStatusId = ds.id
                INNER JOIN config c ON c.`key` = 'link_storage_pictures'
                WHERE
                    du.statusId = :statusId AND
                    du.userId = :userId AND doc.deleted_at IS NULL

        ";

        $bind = [':statusId' => Status::ATIVO, ':userId' => $userId];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $userId
     * @param $docId
     * @return mixed
     */
    public function findByUserAndDoc($userId, $docId)
    {
        $sql = "
            SELECT
                du.*
            FROM {$this->table} du
                WHERE
                    du.docId = :docId AND
                    du.userId = :userId
                ORDER BY du.created_at DESC
        ";

        $bind = [':docId' => $docId, ':userId' => $userId];

        return $this->sqlRawSelect($sql, $bind)
            ->first();
    }
}