<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 17:50
 */
class TripDiscountCouponDao extends BaseDao
{
    protected $table = 'tripDiscountCoupon';

    public function findByTrip($tripReference)
    {
        $sql = "
            SELECT
                tdc.id,
                tdc.tripReference,
                tdc.oldPrice,
                tdc.userDiscountCouponId,
                udc.used,
                dc.code,
                dc.value,
                dc.valueType,
                dc.dateStart,
                dc.dateEnd
            FROM {$this->table} tdc
              INNER JOIN userDiscountCoupon udc ON udc.id = tdc.userDiscountCouponId
              INNER JOIN discountCoupon dc ON dc.id = udc.discountCouponId
              WHERE tdc.tripReference = :tripReference
        ";

        $bind = [':tripReference' => $tripReference];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}