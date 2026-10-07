<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/09/2019
 * Time: 17:41
 */
class PriceHelpDao extends BaseDao
{
    protected $table = "priceHelp";

    public function findByCity($cityId)
    {
        $sql = "
            SELECT
              ah.name AS help,
              ah.picture,
              ph.*
            FROM {$this->table} ph
              INNER JOIN accessibilityHelp ah ON 
                (ah.id = ph.accessibilityHelpId AND ah.statusId = :status)
              WHERE
                ph.statusId = :status AND
                ph.cityId = :cityId
        ";

        return $this->sqlRawSelect($sql, [
            ':status' => Status::ATIVO,
            ':cityId' => $cityId,
        ])
            ->get();
    }
}