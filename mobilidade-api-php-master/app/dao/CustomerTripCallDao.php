<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Driver;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/01/2019
 * Time: 13:57
 */
class CustomerTripCallDao extends BaseDao
{
    protected $table = "tripDrivers";

    public function findDrivers($tripReference)
    {
        $sql = "
            SELECT
              la.userTypeId AS driverType,
              td.tripReference,
              (6371 * acos(
                   cos( radians(startLatitude) )
                   * cos( radians( d.last_lat ) )
                   * cos( radians( d.last_lon ) - radians(startLongitude) )
                   + sin( radians(startLatitude) )
                   * sin( radians( d.last_lat ) )
                  )
              ) AS proximity,
              (6371 * acos(
                   cos( radians(endLatitude) )
                   * cos( radians( st.latitude ) )
                   * cos( radians( st.longitude ) - radians(endLongitude) )
                   + sin( radians(endLatitude) )
                   * sin( radians( st.latitude ) )
                  )
              ) AS destinationProximity,
              d.last_lat AS driverLatitude,
              d.last_lon AS driverLongitude,
              td.radius,
              td.tripTypeId,
              td.favoriteDrivers,
              td.typeCalled,
              td.callClose,
              td.allowsFavorite,
              d.userId,
              d.idDriver,
              u.deviceToken
            FROM tripDrivers td
              INNER JOIN tripTypeDriver ttd on ttd.tripTypeId = td.tripTypeId
              INNER JOIN levelAccess la on la.userTypeId = ttd.userTypeId
              INNER JOIN driver d on la.userId = d.userId
              INNER JOIN user u ON u.idUser = d.userId
              INNER JOIN station st ON d.stationId = st.idStation
            WHERE
                d.status = :availableStatus AND
                la.userTypeId = ttd.userTypeId AND
                deviceToken IS NOT NULL AND
                tripReference = :tripReference
              HAVING
                proximity < radius
            ORDER BY proximity ASC
        ";

        $bind = [':availableStatus' => Driver::AVAILABLE, ':tripReference' => $tripReference];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}