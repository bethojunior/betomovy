<?php

namespace app\model;

use app\constant\TripTypeConst;
use app\model\User;
use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 24/07/2018
 * Time: 15:00
 */
class TripDrivers extends BaseModel
{
    protected $table = "tripDrivers";

    /**
     * @param $driverId
     * @param $listTripsDenied
     * @return array
     */
    public function getSqlForSearchTrips($driverId, $listTripsDenied)
    {
        $sql = "SELECT
                  (6371 * acos(
                       cos( radians(driver.last_lat) )
                       * cos( radians(startLatitude) )
                       * cos( radians(startLongitude) - radians(driver.last_lon))
                       + sin( radians(driver.last_lat) )
                       * sin( radians(startLatitude) )
                       )
                    ) AS proximity,
                    (6371 * acos(
                       cos( radians(s.latitude) )
                       * cos( radians(endLatitude) )
                       * cos( radians(endLongitude) - radians(s.longitude))
                       + sin( radians(s.latitude) )
                       * sin( radians(endLatitude) )
                     )
                    ) AS destinationProximity,
                    la.userTypeId AS driverType,
                    tripDrivers.*
                FROM tripDrivers
                     INNER JOIN driver on driver.idDriver = :driverId
                     INNER JOIN station s on driver.stationId = s.idStation
                     INNER JOIN levelAccess la on la.userId = driver.userId
                     INNER JOIN tripTypeDriver ttd on ttd.tripTypeId = tripDrivers.tripTypeId
                    WHERE tripDrivers.callingDriver = :driverId1
                 HAVING
                    proximity < radius
                 ORDER BY proximity ASC LIMIT 1";

        $sql .= empty($listTripsDenied) ? " " : " AND tripReference NOT IN ('" . implode("','", $listTripsDenied) . "') ";
//
//        $sql .= "
//            HAVING
//              CASE
//                 WHEN
//                    tripDrivers.tripTypeId = :returnType THEN
//                        CASE
//                          WHEN
//                            tripDrivers.favoriteDrivers IS NOT NULL AND
//                            tripDrivers.allowsFavorite = false
//                          THEN
//                            proximity < radius
//                          WHEN tripDrivers.favoriteDrivers IS NOT NULL THEN
//                            FIND_IN_SET(:driverId1, tripDrivers.favoriteDrivers) > 0
//                          WHEN tripDrivers.callClose = 1 THEN
//                            proximity < radius
//                          ELSE
//                            destinationProximity < tripDrivers.radius AND
//                            proximity < tripDrivers.radius AND
//                            FIND_IN_SET(driverType, tripDrivers.typeCalled) > 0
//                        END
//                 ELSE
//                    CASE WHEN tripDrivers.favoriteDrivers IS NULL THEN
//                        proximity < radius
//                    WHEN
//                        tripDrivers.favoriteDrivers IS NOT NULL AND
//                        tripDrivers.allowsFavorite = false
//                    THEN
//                        proximity < radius
//                    ELSE
//                        FIND_IN_SET(:driverId2, tripDrivers.favoriteDrivers) > 0
//                    END
//              END
//            ORDER BY proximity ASC LIMIT 1
//        ";

        $bind[':driverId'] = $driverId;
        $bind[':driverId1'] = $driverId;

        return ['sql' => $sql, 'bind' => $bind];
    }

    /**
     * Return one array with a key called 'bind' and other key called 'sql'
     * @param $tripReference
     * @return array
     */
    public function getSqlForSearchDriversByTrip($tripReference)
    {
        $driverTable = (new Driver)->getTableName();
        $userTable = (new User)->getTableName();
        $stationTable = (new Station)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();

        $sql = "SELECT
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
                  u.name,
                  u.email,
                  u.deviceToken
                FROM tripDrivers td
                  INNER JOIN tripTypeDriver ttd on ttd.tripTypeId = td.tripTypeId
                  INNER JOIN {$levelAccessTable} la on la.userTypeId = ttd.userTypeId
                  INNER JOIN {$driverTable} d on la.userId = d.userId
                  INNER JOIN {$userTable} u ON u.idUser = d.userId
                  INNER JOIN {$stationTable} st ON d.stationId = st.idStation
                WHERE 
                      d.status = :status AND 
                      deviceToken IS NOT NULL AND
                      la.userTypeId = ttd.userTypeId AND
                      td.tripReference = :tripReference
                    HAVING
                      CASE
                         WHEN 
                          td.tripTypeId = :returnType THEN
                            CASE
                              WHEN
                                td.favoriteDrivers IS NOT NULL AND
                                td.allowsFavorite = false
                              THEN
                                proximity < radius
                              WHEN td.favoriteDrivers IS NOT NULL THEN
                                FIND_IN_SET(d.idDriver, td.favoriteDrivers) > 0 AND (destinationProximity < radius AND proximity < radius)
                              WHEN td.callClose = 1 THEN
                                proximity < radius
                              ELSE
                                destinationProximity < radius AND
                                proximity < radius  AND
                                FIND_IN_SET(driverType, td.typeCalled) > 0
                            END
                         ELSE
                            CASE WHEN td.favoriteDrivers IS NULL THEN
                              proximity < radius
                            WHEN
                              td.favoriteDrivers IS NOT NULL AND
                              td.allowsFavorite = false
                            THEN
                              proximity < radius
                            ELSE
                              FIND_IN_SET(d.idDriver, td.favoriteDrivers) > 0 AND proximity < radius
                            END
                      END
                    ORDER BY proximity ASC";

        $bind = [
            ':status' => Driver::AVAILABLE,
            ':tripReference' => $tripReference,
            ':returnType' => TripTypeConst::RETURN
        ];

        return ['sql' => $sql, 'bind' => $bind];
    }
}