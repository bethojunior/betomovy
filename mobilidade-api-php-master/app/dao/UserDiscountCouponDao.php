<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 13:33
 */
class UserDiscountCouponDao extends BaseDao
{
    protected $table = 'userDiscountCoupon';

    public function findByUserAndCoupon($userId, $discountCouponId)
    {
        return $this->sqlSelect([],
            [
                ['userId', '=', ':userId', 'AND'],
                ['discountCouponId', '=', ':discountCouponId']
            ]
        )
            ->bind([
                ':userId' => $userId,
                ':discountCouponId' => $discountCouponId,
            ])
            ->get(false);
    }

    public function findByUser($userId)
    {
        $sql = "
            SELECT
                udc.id,
                udc.discountCouponId,
                udc.userId,
                udc.used,
                code,
                tPF.name AS tripPaymentForm,
                g.name AS gender,
                c.nome AS city,
                value,
                valueType,
                dC.maxDiscountValue,
                limitedTo,
                fromValue,
                bonusDriver,
                uniqueUse,
                dC.statusId,
                dC.active,
                dateStart,
                dateEnd,
                dC.created_at,
                updated_at
            FROM userDiscountCoupon udc
                INNER JOIN discountCoupon dC on udc.discountCouponId = dC.id
                LEFT JOIN tripPaymentForm tPF on dC.tripPaymentFormId = tPF.idTripPaymentForm
                LEFT JOIN gender g on dC.genderId = g.id
                LEFT JOIN city c on dC.cityId = c.id
                WHERE
                      udc.userId = :userId AND
                      udc.used = 0 AND
                      dC.statusId = 1 AND
                      dC.active = 1 AND
                      dC.dateEnd > :dateEnd
                ORDER BY dC.dateEnd
        ";

        $bind = [
            ':userId' => $userId,
            ':dateEnd' => now()
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function find($id)
    {
        $sql = "
            SELECT
                udc.id,
                udc.discountCouponId,
                udc.userId,
                udc.used,
                code,
                tPF.name AS tripPaymentForm,
                g.name AS gender,
                c.nome AS city,
                dC.tripPaymentFormId,
                dC.genderId,
                dC.cityId,
                value,
                valueType,
                limitedTo,
                fromValue,
                bonusDriver,
                uniqueUse,
                dC.statusId,
                dC.active,
                dateStart,
                dateEnd,
                dC.created_at,
                updated_at
            FROM userDiscountCoupon udc
                INNER JOIN discountCoupon dC on udc.discountCouponId = dC.id
                LEFT JOIN tripPaymentForm tPF on dC.tripPaymentFormId = tPF.idTripPaymentForm
                LEFT JOIN gender g on dC.genderId = g.id
                LEFT JOIN city c on dC.cityId = c.id
                WHERE
                      udc.id = :id AND
                      udc.used = 0 AND
                      dC.statusId = 1 AND
                      dC.active = 1
                LIMIT 1
        ";

        $bind = [
            ':id' => $id
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    /**
     * @param $id
     * @return bool
     * @throws Exception
     */
    public function useCoupon($id)
    {
        return $this->sqlUpdate(
            ['used' => ':used'],
            [
                ['id', '=', ':id']
            ],
            [
                ':used' => true,
                ':id' => $id
            ]);
    }
}