<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Spot;
use app\model\SpotType;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/09/2018
 * Time: 17:03
 */
class SpotDao extends BaseDao
{
    const LAST_DAYS = 7;

    public function insertIndication($request)
    {
        $request->spotTypeId = SpotType::ESTABLISHMENT_INDICATION_BY_FILTER;

        $this->sqlInsert(new Spot($request));

        return $this->sqlSelect([], [], ['id', 'DESC'], 1)
            ->get(false);
    }

    public function getByEstablishment(int $establishmentId)
    {
        $date = subDays(today(), self::LAST_DAYS);

        $sql = "
            SELECT
               spot.establishmentId,
               SUM(
                CASE
                  WHEN spot.spotTypeId = 1 THEN 1
                  ELSE 0
                END
               ) AS indicationByFilter,
               SUM(
                CASE
                  WHEN spot.spotTypeId = 2 THEN 1
                  ELSE 0
                END
               ) AS directIndication,
               SUM(clickPhotos) AS clickPhotos,
               SUM(clickPhone) AS clickPhone,
               SUM(clickWhats) AS clickWhats
            FROM spot
              WHERE spot.establishmentId = :establishmentId AND
                DATE_FORMAT(spot.created_at, '%Y-%m-%d') BETWEEN :date_start AND :date_end    
        ";

        $bind = [
            ':establishmentId' => $establishmentId,
            ':date_start' => $date,
            ':date_end' => today()
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}