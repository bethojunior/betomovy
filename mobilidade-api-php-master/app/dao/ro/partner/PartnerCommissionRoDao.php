<?php

namespace app\dao\ro\partner;

use app\model\Status;
use app\utils\BaseDao;
use app\utils\Connection;

class PartnerCommissionRoDao extends BaseDao
{
    protected $table = 'partnerCommission';

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findByUser($userId)
    {
        $sql = /** @lang sql */  "
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