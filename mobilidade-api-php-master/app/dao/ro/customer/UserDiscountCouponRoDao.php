<?php

namespace app\dao\ro\customer;

use app\utils\BaseDao;
use app\utils\Connection;

class UserDiscountCouponRoDao extends BaseDao
{
    protected $table = 'userDiscountCoupon';

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findByUser($userId)
    {
        $sql = /** @lang sql */  "
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
}