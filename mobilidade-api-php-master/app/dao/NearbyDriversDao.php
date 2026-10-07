<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/05/2019
 * Time: 15:25
 */
class NearbyDriversDao extends BaseDao
{
    protected $table = 'driver';

    public function quantityDriversClose($lat, $lon, $tripTypeId)
    {
        $sql = "
            SELECT
              (6371 * acos(
                 cos( radians(:lat) )
                 * cos( radians( d.last_lat ) )
                 * cos( radians( d.last_lon ) - radians(:lon) )
                 + sin( radians(:lat) )
                 * sin( radians( d.last_lat ) )
                )
              ) AS proximity,
              u.name,
              la.userTypeId,
              z.radius
            FROM price p
              INNER JOIN tripTypeDriver ttd ON ttd.tripTypeId = :tripTypeId
              INNER JOIN levelAccess la on la.userTypeId = ttd.userTypeId
              INNER JOIN city c on p.cityId = c.id
              INNER JOIN cityArea cA on c.id = cA.cityId
              INNER JOIN zone z on
                    (c.id = z.cityId AND z.statusId = :statusActive)
              INNER JOIN driver d on
                    (
                        ST_Contains(
                          cA.polygon,
                          GeomFromText(CONCAT('POINT(', d.last_lat, ' ', d.last_lon, ')'))
                        ) = 1 AND
                        (d.status = 'disponivel' OR
                          (d.status = 'corrida' AND
                           d.preAvailable = 1 AND
                            d.idDriver NOT IN (
                              SELECT pat.driverId
                              FROM pre_accepted_trips_view pat
                            ) AND
                            d.idDriver IN (
                              SELECT trip.driverId
                              FROM trip
                                WHERE trip.status = 'in_progress'
                            )
                        )) AND
                        la.userId = d.userId AND
                        d.driverRegisterStatusId = :statusActive
                    )
              INNER JOIN user u on d.userId = u.idUser
              WHERE
                  p.statusId = :statusActive
              GROUP BY d.idDriver
              HAVING
                  proximity <= z.radius
              ORDER BY proximity ASC
        ";

        $bind = [
            ':lat' => $lat,
            ':lon' => $lon,
            ':statusActive' => Status::ATIVO,
            ':tripTypeId' => $tripTypeId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}