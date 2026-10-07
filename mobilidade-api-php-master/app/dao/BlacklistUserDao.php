<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/01/2019
 * Time: 15:16
 */
class BlacklistUserDao extends BaseDao
{
    protected $table = 'blacklistUser';

    public function findExpired()
    {
        $sql = "
            SELECT
              bu.idBlacklistUser,
              bu.created_at,
              bu.expiration_time,
              bu.timeSuspended,
              bu.userId,
              bu.statusId,
              la.userTypeId,
              u.deviceToken
            FROM {$this->table} bu
              INNER JOIN user u on bu.userId = u.idUser
              INNER JOIN levelAccess la on u.idUser = la.userId
            WHERE bu.expiration_time < :date AND bu.statusId = :statusId;
        ";

        $bind = [
            ':statusId' => Status::ATIVO,
            ':date' => now(),
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $idBlacklist
     * @return bool
     * @throws Exception
     */
    public function remove($idBlacklist)
    {
        return $this->sqlUpdate(
            ['statusId' => ':statusId'],
            [['idBlacklistUser', '=', ':idBlacklistUser']],
            [':statusId' => Status::EXCLUIDO, ':idBlacklistUser' => $idBlacklist]
        );
    }
}