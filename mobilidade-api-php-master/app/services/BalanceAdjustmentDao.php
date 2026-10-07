<?php

namespace app\services;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/03/2019
 * Time: 17:49
 */
class BalanceAdjustmentDao extends BaseDao
{
    public function getDrivers()
    {
        $sql = "
            SELECT
              d.idDriver,
              u.name,
              d.balanceId,
              b.balance,
              b.blockedBalanceToPay
            FROM driver d
              INNER JOIN user u on d.userId = u.idUser
              INNER JOIN levelAccess la on u.idUser = la.userId
              INNER JOIN balance b on d.balanceId = b.idBalance
              WHERE
                b.balance < 0
              GROUP BY d.idDriver
              ORDER BY b.balance ASC;
        ";

        return $this->sqlRawSelect($sql)
            ->get();
    }
}