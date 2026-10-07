<?php

namespace app\dao;

use app\utils\BaseDao;

use stdClass;

class UserConfirmationCodeDao extends BaseDao
{
    protected $table = "userConfirmationCode";

    public function findLastValidConfirmationCode(int $userId): ?stdClass
    {
        return $this->sqlSelect(
            [],
            [
                ['userConfirmationCode.validUntil', '>', ':now', 'AND'],
                ['userConfirmationCode.userId', '=', ':userId', 'AND'],
                ['userConfirmationCode.isUsed', '=', '0']
            ],
            [
                'userConfirmationCode.id', 'DESC'
            ],
            1
        )
            ->bind(
                [
                    ':now' => now(),
                    ':userId' => $userId
                ]
            )
            ->get(false);
    }

    public function markUsed(int $id): bool
    {
        return $this->sqlUpdate(
            [
                'isUsed' => 1,
                'usedAt' => ':now'
            ],
            [['id', '=', ':id']],
            [
                ':id' => $id,
                ':now' => now()
            ]
        );
    }
}