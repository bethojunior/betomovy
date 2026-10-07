<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Location;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/05/2019
 * Time: 18:00
 */
class TripConfigAreaDao extends BaseDao
{
    public function getByOriginArea(Location $point, $userId, $tripTypeId)
    {
        $sql = "
            SELECT
              dc.idDriverCommission,
              c.id AS cityId,
              z.idZone,
              pc.id AS partnerCommissionId
            FROM cityArea ca
              INNER JOIN city c on ca.cityId = c.id
              INNER JOIN zone z on
                    (c.id = z.cityId AND z.statusId = :statusActive)
              INNER JOIN driverCommission dc on
                    (c.id = dc.cityId AND 
                      dc.tripTypeId = :tripTypeId AND 
                      dc.statusId = :statusActive)
              INNER JOIN partner p ON p.userId = :userId
              LEFT JOIN partnerCommission pc ON
                    (pc.statusId = :statusActive AND
                      pc.tripTypeId = :tripTypeId AND
                      pc.cityId = ca.cityId)
              WHERE
                  ST_Contains(
                      ca.polygon,
                      ST_GeomFromText(CONCAT('POINT(', :latitude, ' ', :longitude, ')'))
                    ) = 1 AND
                  ca.statusId = :statusActive
            GROUP BY ca.id;
        ";

        $bind = [
            ':statusActive' => Status::ATIVO,
            ':tripTypeId' => $tripTypeId,
            ':userId' => $userId,
            ':latitude' => $point->getLatitude(),
            ':longitude' => $point->getLongitude()
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->first();
    }
}