<?php

namespace app\dao;

use app\model\CreditPrepaidPurchase;
use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/05/2020
 * Time: 13:55
 */
class CreditPrepaidPurchaseDao extends BaseDao
{
    protected $table = "creditPrepaidPurchase";

    public function findByUser($userId)
    {
        return $this->sqlRawSelect("
            SELECT 
                *,
            TIMESTAMPDIFF(SECOND, NOW(), CONCAT(expirationDate, ' 23:59:59')) as timeRemainingInSecconds,
            TIMESTAMPDIFF(DAY, NOW(), expirationDate) as timeRemainingInDays
            FROM {$this->table}
            WHERE credited = 1
              AND userId = :userId
              AND expirationDate IS NOT NULL
              AND expirationDate >= CURRENT_DATE()
            ORDER BY created_at DESC LIMIT 1
        ", [":userId" => $userId])->get(false);
    }

    public function findByUserToByPeriod($userId)
    {
        return $this->sqlRawSelect("
        SELECT 
            *
        FROM {$this->table}
        LEFT JOIN creditPrepaid ON creditPrepaid.id = {$this->table}.creditPrepaidId
        WHERE {$this->table}.credited = 1
          AND {$this->table}.userId = :userId
          AND creditPrepaid.type = 'perPeriod'
          AND {$this->table}.expirationDate IS NOT NULL
          AND {$this->table}.expirationDate >= CURRENT_DATE()
        ORDER BY {$this->table}.created_at DESC LIMIT 1
    ",
            [":userId" => $userId])->get(false);
    }

    public function findByField(string $field, $value)
    {
        return $this->sqlSelect([], [
            [$field, '=', ":{$field}"]
        ])
            ->bind([":{$field}" => $value])
            ->first();
    }

    public function update(CreditPrepaidPurchase $creditPrepaidPurchase): CreditPrepaidPurchase
    {
        $set = [
            'refused' => ':refused',
        ];
        $bind = [
            ':refused' => $creditPrepaidPurchase->getRefused(),
        ];

        foreach ($creditPrepaidPurchase->toArray() as $key => $value) {
            if ($value) {
                if ($key != 'id')
                    $set[$key] = ":$key";

                $bind[":$key"] = $value;
            }
        }

        $this->sqlUpdate($set, [['id', '=', ':id']], $bind);

        return $creditPrepaidPurchase;
    }
}