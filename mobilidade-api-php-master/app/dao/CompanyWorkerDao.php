<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/07/2019
 * Time: 09:30
 */
class CompanyWorkerDao extends BaseDao
{
    protected $table = "companyWorker";

    public function findByField($field, $value)
    {
        $sql = "
            SELECT
                u.*
            FROM {$this->table} cw
              INNER JOIN user u ON cw.userId = u.idUser
              WHERE 
                {$field} = :value AND 
                u.statusId = :statusId AND
                cw.statusId = :statusId
            LIMIT 1
        ";

        return $this->sqlRawSelect($sql, [
            ':value' => $value,
            ':statusId' => Status::ATIVO
        ])
            ->get(false);
    }

    public function findWithCompany($userId)
    {
        $sql = "
            SELECT
                u.*,
                c.name AS companyName,
                c.fantasyName,
                c.voucherLimit,
                b.tripBalance,
                c.balanceId,                
                c.companyRegisterStatusId
            FROM {$this->table} cw
              INNER JOIN user u ON cw.userId = u.idUser
              INNER JOIN company c ON cw.companyId = c.id
              INNER JOIN balance b ON b.idBalance = c.balanceId
              WHERE 
                cw.userId = :userId AND 
                u.statusId = :statusId AND
                cw.statusId = :statusId
            LIMIT 1
        ";

        return $this->sqlRawSelect($sql, [
            ':userId' => $userId,
            ':statusId' => Status::ATIVO
        ])
            ->get(false);
    }
}