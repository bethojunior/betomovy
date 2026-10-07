<?php

namespace app\dao;

use app\constant\PriceDynamicConst;
use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 14:39
 */
class PriceDynamicDao extends BaseDao
{
    protected $table = "priceDynamic";

    public function findActiveInCity($cityId, $date = null)
    {
        $date = $date ?? now();

        $sql = "
            SELECT
              *
            FROM {$this->table} pd
              INNER JOIN schedulePriceDynamic sPD on pd.idPriceDynamic = sPD.priceDynamicId
            WHERE
                pd.statusId = :statusActive AND
                (
                    (
                        (TIME_FORMAT(:date, '%H:%i:%s') BETWEEN sPD.timeStart AND sPD.timeEnd) AND
                        sPD.statusId = :sameStatusActive
                    ) OR
                    pd.activatedManual = :activatedManual
                ) AND
                DAYOFWEEK(:sameDate) = pd.dayOfWeek AND
                pd.cityId = :cityId
                    LIMIT 1
        ";

        $bind = [
            ':statusActive' => Status::ATIVO,
            ':sameStatusActive' => Status::ATIVO,
            ':activatedManual' => PriceDynamicConst::ACTIVATED_MANUAL,
            ':date' => $date,
            ':sameDate' => $date,
            ':cityId' => $cityId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}