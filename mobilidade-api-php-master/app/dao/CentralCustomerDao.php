<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/07/2019
 * Time: 10:03
 */
class CentralCustomerDao extends BaseDao
{
    protected $table = 'centralCustomer';

    const DEFAULT_RATING = 0;
    const DEFAULT_QUANTITY_TRIPS = 0;

    public function find($id)
    {
        $sql = "
            SELECT
                cc.id,
                cc.phone,
                cc.name,
                cc.name AS nickname,
                cust.profileImage AS profileImage,
                COALESCE(u.rating, :defaultRating) AS rating,
                COALESCE(u.quantityTrips, :defaultQuantityTrips) AS quantityTrips
            FROM centralCustomer cc
                INNER JOIN central c on cc.centralId = c.id
                LEFT JOIN user u ON u.idUser = cc.userId
                LEFT JOIN customer cust ON cust.userId = u.idUser
              WHERE cc.id = :id
        ";

        $bind = [
            'id' => $id,
            'defaultRating' => self::DEFAULT_RATING,
            'defaultQuantityTrips' => self::DEFAULT_QUANTITY_TRIPS,
        ];

        return $this->sqlRawSelect($sql, $bind)->get(false);
    }

    public function findUserId($id)
    {
        return $this->sqlSelect(['userId'], [['id', '=', ':id']])
            ->bind([':id' => $id])
            ->get(false);
    }
}