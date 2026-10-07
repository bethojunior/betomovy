<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 13:46
 */
class DiscountCouponDao extends BaseDao
{
    protected $table = "discountCoupon";

    public function findByCode($code)
    {
        $sql = "
            SELECT
                *
            FROM discountCoupon dc
                WHERE
                    dc.code LIKE :code AND
                    dc.statusId = 1 AND
                    dc.active = 1
                    ORDER BY dc.id DESC
                LIMIT 1
        ";

        $bind = [
            ':code' => $code
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findByPromotionId($promotionId)
    {
        $sql = "
            SELECT
                *
            FROM discountCoupon dc
                WHERE
                    dc.saleTripId = :promotionId AND
                    dc.statusId = 1 AND
                    dc.active = 1
                    ORDER BY dc.id DESC
                LIMIT 1
        ";

        $bind = [
            ':promotionId' => $promotionId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}