<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

class SmtpServerDao extends BaseDao
{
    protected $table = "smtpServer";

    public function findActive($withoutId = null)
    {
        $queryWithoutId = $withoutId ? " AND id NOT IN (:withoutId)" : "";

        $sql = /** @lang sql */
            "SELECT *
                    FROM smtpServer as smtp
                WHERE smtp.statusId = :statusId $queryWithoutId
                ORDER BY smtp.default DESC 
                LIMIT 1";

        $binds = [
            ':statusId' => Status::ATIVO
        ];

        if ($withoutId) {
            $binds[':withoutId'] = $withoutId;
        }

        $result = $this->sqlRawSelect($sql, $binds)->get(false);

        if (empty($result))
            return null;

        return $result;
    }

    public function incrementRetry($id)
    {
        $sql = /** @lang sql */
            "UPDATE smtpServer as smtp
                    SET smtp.retry = smtp.retry + 1
                WHERE id = :id";
        $this->sqlRawUpdate($sql, [
            ':id' => $id
        ]);
    }

    public function disableDefault($id)
    {
        $sql = /** @lang sql */
            "UPDATE smtpServer as smtp
                    SET smtp.default = false
                WHERE id = :id";
        $this->sqlRawUpdate($sql, [
            ':id' => $id
        ]);
    }

    public function enableDefault($id)
    {
        $sql = /** @lang sql */
            "UPDATE smtpServer as smtp
                    SET smtp.default = true
                WHERE id = :id";
        $this->sqlRawUpdate($sql, [
            ':id' => $id
        ]);
    }

    public function resetTries($id)
    {
        $sql = /** @lang sql */
            "UPDATE smtpServer as smtp
                    SET smtp.retry = 0
                WHERE id = :id";
        $this->sqlRawUpdate($sql, [
            ':id' => $id
        ]);
    }
}