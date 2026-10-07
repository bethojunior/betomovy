<?php

namespace app\dao\ro\user;

use app\model\Status;
use app\utils\BaseDao;
use app\utils\Connection;

class PartnerRoDao extends BaseDao
{
    protected $table = 'partner';

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findByUser($userId)
    {
        $sql = /** @lang sql */ "
            SELECT
                p.*,
                u.name,
                u.nickname,
                u.phone,
                u.email,
                u.rating,
                u.platform,
                u.last_lat,
                u.last_lon,
                prs.name AS partnerRegister,
                b.tripBalance,
                b.balance,
                c.balanceId,
                c.idCustomer
            FROM {$this->table} p
              INNER JOIN user u ON u.idUser = p.userId
              INNER JOIN partnerRegisterStatus prs ON p.partnerRegisterStatusId = prs.id
              INNER JOIN customer c ON c.userId = p.userId
              INNER JOIN balance b ON c.balanceId = b.idBalance
            WHERE 
              p.userId = :userId AND
              p.statusId = :statusId
        ";

        $bind = [
            ':userId' => $userId,
            ':statusId' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->first();
    }

    public function findSimpleByUser(int $userId)
    {
        $sql = /** @lang sql */ "
            SELECT
                p.idPartner,
                p.userId,
                p.api_token,
                p.partnerRegisterStatusId,
                p.statusId,
                p.created_at
            FROM partner p
            WHERE 
              p.userId = :userId AND
              p.statusId = :statusId
        ";

        $bind = [
            ':userId' => $userId,
            ':statusId' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->first();
    }
}