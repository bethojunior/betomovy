<?php

namespace app\dao;

use app\constant\DriverCalledConst;
use app\model\Status;
use app\model\Trip;
use app\utils\BaseDao;
use app\model\TripDrivers;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 24/07/2018
 * Time: 14:59
 */
class TripDriversDao extends BaseDao
{
    protected $table = "tripDrivers";

    public function getDriversClose($tripReference)
    {
        $query = (new TripDrivers)->getSqlForSearchDriversByTrip($tripReference);

        return $this->sqlRawSelect($query['sql'], $query['bind'])->get();
    }

    public function getAll()
    {
        $sql = "
            SELECT
                *
            FROM tripDrivers td
              WHERE td.isCalling = false
              ORDER BY td.date ASC LIMIT 1
        ";

        return $this->sqlRawSelect($sql)
            ->get(false);
    }

    public function find($tripReference)
    {
        $sql = "
            SELECT
              *
            FROM {$this->table} td
              WHERE td.tripReference = :tripReference
              LIMIT 1;
        ";

        $bind = [':tripReference' => $tripReference];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findTripCallingDriver($driverId, $listTripsDenied = [])
    {
        $realCustomerUserId = "COALESCE(centralCustomer.userId, tD.userId)";

        $sql = "
            SELECT
              TIME_TO_SEC(TIMEDIFF(UTC_TIMESTAMP(), dC.updated_at)) AS missingSeconds,
              dC.proximity AS proximity,
              EXISTS(
                SELECT 1
                FROM favoriteDriver fd
                  INNER JOIN customer c ON fd.customerId = c.idCustomer
                WHERE c.userId = {$realCustomerUserId}
                  AND fd.driverId = :favoriteDriverId
                  AND fd.status = :favoriteStatus
              ) AS isFavoriteDriver,
              tD.*
            FROM driverCalled dC
              INNER JOIN {$this->table} tD ON dC.tripReference = tD.tripReference
              INNER JOIN trip ON trip.tripReference = tD.tripReference
              LEFT JOIN centralCustomer ON centralCustomer.id = trip.centralCustomerId
            WHERE
              dC.driverId = :driverId
              AND dC.status = :callingStatus
              AND trip.status IN (:searchingStatus, :searchingFavoriteStatus)
        ";

        $sql .= empty($listTripsDenied) ? " " :
            " AND tD.tripReference NOT IN ('" . implode("','", $listTripsDenied) . "') ";
        $sql .= "ORDER BY dC.updated_at DESC LIMIT 1";

        $bind = [
            ':driverId' => $driverId,
            ':favoriteDriverId' => $driverId,
            ':favoriteStatus' => Status::ATIVO,
            ':callingStatus' => DriverCalledConst::CALLING,
            ':searchingStatus' => Trip::SEARCHING,
            ':searchingFavoriteStatus' => Trip::SEARCHING_FAVORITE,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}