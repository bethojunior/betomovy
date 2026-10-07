<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/05/2019
 * Time: 14:23
 */
class PartnerCommissionDao extends BaseDao
{
    protected $table = 'partnerCommission';

    public function find($id)
    {
        return $this->sqlSelect([], [
            ['id', '=', ':id']
        ])
            ->bind([':id' => $id])
            ->get(false);
    }

    public function findWithManager($id)
    {
        $sql = "
            SELECT
                pc.id,
                pc.partnerId,
                pc.partnerCommissionType,
                pc.partnerCommissionValue,
                pc.appCommissionType,
                pc.appCommissionValue,
                pc.managerCommissionType,
                pc.managerCommissionValue,
                p.managerId
            FROM {$this->table} pc
              INNER JOIN partner p ON p.idPartner = pc.partnerId
              LEFT JOIN manager m ON p.managerId = m.id
            WHERE 
              pc.id = :id
            LIMIT 1
        ";

        $bind = [
            ':id' => $id,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findByUser($userId)
    {
        $sql = "
            SELECT
                pc.id,
                pc.partnerId,
                pc.partnerCommissionType,
                pc.partnerCommissionValue,
                pc.appCommissionType,
                pc.appCommissionValue,
                pc.managerCommissionType,
                pc.managerCommissionValue,
                p.managerId
            FROM {$this->table} pc
              INNER JOIN partner p ON p.idPartner = pc.partnerId
              LEFT JOIN manager m ON p.managerId = m.id
            WHERE 
              pc.statusId = :statusActive AND
              p.userId = :userId
            LIMIT 1
        ";

        $bind = [
            ':statusActive' => Status::ATIVO,
            ':userId' => $userId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}