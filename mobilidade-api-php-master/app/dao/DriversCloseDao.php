<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/11/2019
 * Time: 11:53
 */
class DriversCloseDao extends BaseDao
{
    protected $table = 'driver';

    public function findClose($lat, $lng, $userId, $onlyActives = true)
    {
        $filterStatus = '(d.status = \'disponivel\' OR d.status = \'corrida\') AND';

        $filterWhere = $onlyActives ? null : "WHERE {$filterStatus} d.userId <> :userId";

        $sql = "
            SELECT (6371 * acos(
                        cos(radians(:lat))
                        * cos(radians(d.last_lat))
                        * cos(radians(d.last_lon) - radians(:lng))
                    + sin(radians(:lat))
                            * sin(radians(d.last_lat))
            )
                   )      AS proximity,
               z.radius,
               d.last_lat AS latitude,
               d.last_lon AS longitude,
               iMD.link AS iconMapDriver
        FROM driver d
                 INNER JOIN cityArea ca
                            ON (
                                    ca.statusId = 1 AND
                                    ST_Contains(
                                            ca.polygon,
                                            ST_GeomFromText(CONCAT('POINT(', :lat, ' ', :lng, ')'))) = 1)
                 INNER JOIN zone z ON
            (ca.cityId = z.cityId AND z.statusId = 1)
                INNER JOIN levelAccess lA on d.userId = lA.userId
                INNER JOIN userType uT on lA.userTypeId = uT.idUserType
                LEFT JOIN iconMapDriver iMD on uT.iconMapDriverId = iMD.id
            $filterWhere
        HAVING
            proximity
             < z.radius
        ORDER BY proximity;
        ";

        $bind = [
            ':lat' => $lat,
            ':lng' => $lng,
            ':userId' => $userId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function findCloseForAlert($lat, $lng, $userId)
    {
        $sql = "
            SELECT (6371 * acos(
                            cos(radians(:lat))
                            * cos(radians(d.last_lat))
                            * cos(radians(d.last_lon) - radians(:lng))
                        + sin(radians(:lat))
                                * sin(radians(d.last_lat))
                )
                       )      AS proximity,
                   z.greaterRadius,
                   u.name,
                   d.last_lat AS latitude,
                   d.last_lon AS longitude,
                   u.deviceToken
            FROM driver d
                     INNER JOIN user u ON d.userId = u.idUser
                     INNER JOIN cityArea ca
                                ON (
                                        ca.statusId = 1 AND
                                        ST_Contains(
                                                ca.polygon,
                                                ST_GeomFromText(CONCAT('POINT(', :lat, ' ', :lng, ')'))) = 1)
                     INNER JOIN zone z ON
                (ca.cityId = z.cityId AND z.statusId = 1)
            WHERE (
                d.status = 'disponivel' OR d.status = 'corrida'
                )
              AND d.userId <> :userId
              AND u.deviceToken IS NOT NULL
              AND NOT EXISTS(SELECT driverId
                             FROM trip
                             WHERE userId = :idUser
                               AND status NOT IN ('finished', 'canceled', 'back_off', 'not_answered', 'payment_refused')
                               AND trip.driverId = d.idDriver)
            HAVING proximity < z.greaterRadius
            ORDER BY proximity;
        ";

        $bind = [
            ':lat' => $lat,
            ':lng' => $lng,
            ':userId' => $userId,
            ':idUser' => $userId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}