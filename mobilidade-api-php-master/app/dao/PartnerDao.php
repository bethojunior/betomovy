<?php

namespace app\dao;

use app\constant\PartnerRegisterStatusConst;
use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 07/05/2019
 * Time: 18:06
 */
class PartnerDao extends BaseDao
{
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

    /**
     * @param $managerId
     * @param $userId
     * @return bool
     * @throws Exception
     */
    public function updateManager($managerId, $userId)
    {
        return $this->sqlUpdate(
            ['managerId' => ':managerId', 'partnerRegisterStatusId' => ':partnerRegisterStatusId'],
            [['userId', '=', ':userId', 'AND'], ['statusId', '=', ':statusId']],
            [
                ':managerId' => $managerId,
                ':partnerRegisterStatusId' => PartnerRegisterStatusConst::ACTIVE,
                ':userId' => $userId,
                ':statusId' => Status::ATIVO,
            ]
        );
    }
}