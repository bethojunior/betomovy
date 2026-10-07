<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\PDOPagination;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/06/2019
 * Time: 15:03
 */
class ManagerBillingDao extends BaseDao
{
    public function getTripsBilling($request, $userId)
    {
        $sql = "
            SELECT
                t.date,
                t.tripReference,
                t.driverName,
                t.driverPhoto,
                t.price,
                c.nome AS cityName,
                t.driverId
            FROM trip_summary_view t
                INNER JOIN city c ON c.id = t.cityId 
                INNER JOIN user um ON um.idUser = :userId
                INNER JOIN manager m on um.idUser = m.userId
                INNER JOIN driver d on t.driverId = d.idDriver
                INNER JOIN userIndication uI on
                    (uI.whoIndicatedId = um.idUser AND
                     d.userId = userIndicatedId AND
                     t.date > uI.created_at AND
                     t.date NOT BETWEEN uI.created_at AND uI.refund_to_fees_up_to)
                WHERE
                      t.status = 'finished' AND
                      t.tripAuditId <> 5 
        ";

        $bind = [
            ':userId' => $userId
        ];

        $this->requestFilters($request, $sql, $bind);

        $sql .= " ORDER BY t.date DESC";

        $paginator = new PDOPagination($sql, $bind);

        return $paginator
            ->paginate($request['page'] ?? 1, 10);
    }

    public function getCommissionsBilling($request, $userId)
    {
        $sql = "
            SELECT
                COUNT(t.idTrip) AS quantity,
                FORMAT(ROUND(IFNULL(SUM(t.price), 0),2), 2, 'de_DE') AS total_value,
                FORMAT(IFNULL(ROUND(CASE
                    WHEN m.valueTypeCommission = '%' THEN
                        (SUM(t.price) / 100) * m.valueCommission
                    ELSE
                        COUNT(t.idTrip) * m.valueCommission
                END, 2), 0), 2, 'de_DE') AS total_commission
            FROM trip t
                INNER JOIN user um ON um.idUser = :userId
                INNER JOIN manager m on um.idUser = m.userId
                INNER JOIN driver d on t.driverId = d.idDriver
                INNER JOIN userIndication uI on
                    (uI.whoIndicatedId = um.idUser AND
                     d.userId = userIndicatedId AND
                     t.date > uI.created_at AND
                     t.date NOT BETWEEN uI.created_at AND uI.refund_to_fees_up_to)
                WHERE
                      t.status = 'finished' AND
                      t.tripAuditId <> 5
        ";

        $bind = [
            ':userId' => $userId
        ];

        $this->requestFilters($request, $sql, $bind);

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function getCitiesWithBilling($userId)
    {
        $sql = "
            SELECT
                t.cityId,
                c.nome AS cityName
            FROM trip t
                INNER JOIN city c ON c.id = t.cityId 
                INNER JOIN user um ON um.idUser = :userId
                INNER JOIN manager m on um.idUser = m.userId
                INNER JOIN driver d on t.driverId = d.idDriver
                INNER JOIN userIndication uI on
                    (uI.whoIndicatedId = um.idUser AND
                     d.userId = userIndicatedId AND
                     t.date > uI.created_at AND
                     t.date NOT BETWEEN uI.created_at AND uI.refund_to_fees_up_to)
                WHERE
                      t.status = 'finished' AND
                      t.tripAuditId <> 5
            GROUP BY t.cityId
        ";

        $bind = [
            ':userId' => $userId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function getDriversWithBilling($userId)
    {
        $sql = "
            SELECT
                t.driverId,
                t.driverName
            FROM trip_summary_view t
                INNER JOIN city c ON c.id = t.cityId 
                INNER JOIN user um ON um.idUser = :userId
                INNER JOIN manager m on um.idUser = m.userId
                INNER JOIN driver d on t.driverId = d.idDriver
                INNER JOIN userIndication uI on
                    (uI.whoIndicatedId = um.idUser AND
                     d.userId = userIndicatedId AND
                     t.date > uI.created_at AND
                     t.date NOT BETWEEN uI.created_at AND uI.refund_to_fees_up_to)
                WHERE
                      t.status = 'finished' AND
                      t.tripAuditId <> 5
            GROUP BY t.driverId
        ";

        $bind = [
            ':userId' => $userId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    private function requestFilters(array $request, &$sql, &$bind)
    {
        if (isset($request['date']) && !empty($request['date'])) {
            $sql .= " AND t.date BETWEEN :startDate AND :endDate";
            $bind[':startDate'] = $request['date'][0];
            $bind[':endDate'] = $request['date'][1];
        }

        if (isset($request['driverId']) && !empty($request['driverId'])) {
            $sql .= " AND t.driverId = :driverId";
            $bind[':driverId'] = $request['driverId'];
        }

        if (isset($request['cityId']) && !empty($request['cityId'])) {
            $sql .= " AND t.cityId = :cityId";
            $bind[':cityId'] = $request['cityId'];
        }
    }
}