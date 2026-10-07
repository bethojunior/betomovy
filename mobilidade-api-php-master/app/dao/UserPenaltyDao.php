<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/01/2019
 * Time: 17:51
 */
class UserPenaltyDao extends BaseDao
{
    protected $table = "userPenalty";

    /**
     * @param $userId
     * @return array|mixed
     */
    public function getByUser($userId)
    {
        return $this->sqlSelect([],
            [
                ['userId', '=', ':userId', 'AND'],
                ['statusId', '=', ':statusId']
            ]
        )
            ->bind([
                'userId' => $userId,
                'statusId' => Status::ATIVO
            ])
            ->get();
    }

    /**
     * @return array|mixed
     */
    public function getActives()
    {
        $now = now();

        $sql = "
            SELECT
                p.*,
                u.name,
                c.value,
                TIMESTAMPDIFF(HOUR, p.created_at, '{$now}') AS diffInHours
            FROM {$this->table} p
              INNER JOIN user u ON u.idUser = p.userId
              INNER JOIN
                 (SELECT
                    `key`,
                    `value`
                 FROM config) c ON c.`key` = 'time_to_clear_driver_penalties'
            WHERE 
              p.statusId = :statusId
            HAVING
              diffInHours > c.value
        ";

        $bind = [
            ':statusId' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param string $penaltiesIds
     * @return bool
     * @throws Exception
     */
    public function removeMany($penaltiesIds)
    {
        return $this->sqlUpdate(
            ['statusId' => ':statusId'],
            [
                ['idUserPenalty', 'IN', '(' . $penaltiesIds . ')']
            ],
            [':statusId' => Status::EXCLUIDO]
        );
    }
}