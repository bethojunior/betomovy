<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/09/2019
 * Time: 09:03
 */
class FreightItemDao extends BaseDao
{
    protected $table = "freightItem";

    public function findByTrip($tripReference)
    {
        $sql = "
            SELECT
                fi.itemId,
                fi.quantity,
                i.description,
                i.picture
            FROM {$this->table} fi
              INNER JOIN items i ON fi.itemId = i.id
              WHERE fi.tripReference = :tripReference
        ";

        $bind = [
            ':tripReference' => $tripReference
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}