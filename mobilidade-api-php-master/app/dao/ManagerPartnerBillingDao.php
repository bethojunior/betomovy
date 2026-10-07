<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\PDOPagination;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/06/2019
 * Time: 16:55
 */
class ManagerPartnerBillingDao extends BaseDao
{
    public function getBilling($request, $userId)
    {
        $sql = "
            SELECT
                bf.date,
                bf.tripReference,
                tsv.userId AS customerUserId,
                u.name AS customerName,
                c.profileImage AS customerPhoto,
                tsv.cityId,
                tsv.cityName,
                bf.value
            FROM balanceFlow bf
                INNER JOIN balanceFlowType bFT on bf.balanceFlowTypeId = bFT.idBalanceFlowType
                INNER JOIN manager m on m.balanceId = bf.balanceId
                INNER JOIN trip_summary_view tsv on bf.tripReference = tsv.tripReference
                INNER JOIN user u on tsv.userId = u.idUser
                INNER JOIN customer c on u.idUser = c.userId
            WHERE
                  m.userId = :userId
        ";

        $bind = [':userId' => $userId];

        $this->requestFilters($request, $sql, $bind);

        $sql .= " ORDER BY bf.date DESC";

        $paginator = new PDOPagination($sql, $bind);

        return $paginator
            ->paginate($request['page'] ?? 1, 10);
    }

    public function getCommissionsBilling($request, $userId)
    {
        $sql = "
            SELECT
                COUNT(bf.idBalanceFlow) AS quantity,
                ROUND(IFNULL(SUM(tsv.price), 0), 2) AS total_value,
                ROUND(IFNULL(SUM(bf.value), 0), 2) AS total_commission
            FROM balanceFlow bf
                INNER JOIN balanceFlowType bFT on bf.balanceFlowTypeId = bFT.idBalanceFlowType
                INNER JOIN manager m on m.balanceId = bf.balanceId
                INNER JOIN trip_summary_view tsv on bf.tripReference = tsv.tripReference
                INNER JOIN user u on tsv.userId = u.idUser
                INNER JOIN customer c on u.idUser = c.userId
            WHERE
                  m.userId = :userId
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
                tsv.cityId,
                tsv.cityName
            FROM balanceFlow bf
                INNER JOIN balanceFlowType bFT on bf.balanceFlowTypeId = bFT.idBalanceFlowType
                INNER JOIN manager m on m.balanceId = bf.balanceId
                INNER JOIN trip_summary_view tsv on bf.tripReference = tsv.tripReference
                INNER JOIN user u on tsv.userId = u.idUser
                INNER JOIN customer c on u.idUser = c.userId
            WHERE
                  m.userId = :userId
            GROUP BY tsv.cityId
        ";

        $bind = [
            ':userId' => $userId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function getPartnersWithBilling($userId)
    {
        $sql = "
            SELECT
                tsv.userId AS customerUserId,
                u.name AS customerName
            FROM balanceFlow bf
                INNER JOIN balanceFlowType bFT on bf.balanceFlowTypeId = bFT.idBalanceFlowType
                INNER JOIN manager m on m.balanceId = bf.balanceId
                INNER JOIN trip_summary_view tsv on bf.tripReference = tsv.tripReference
                INNER JOIN user u on tsv.userId = u.idUser
                INNER JOIN customer c on u.idUser = c.userId
            WHERE
                  m.userId = :userId
            GROUP BY tsv.userId
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
            $sql .= " AND bf.date BETWEEN :startDate AND :endDate";
            $bind[':startDate'] = $request['date'][0];
            $bind[':endDate'] = $request['date'][1];
        }

        if (isset($request['driverId']) && !empty($request['driverId'])) {
            $sql .= " AND tsv.driverId = :driverId";
            $bind[':driverId'] = $request['driverId'];
        }

        if (isset($request['cityId']) && !empty($request['cityId'])) {
            $sql .= " AND tsv.cityId = :cityId";
            $bind[':cityId'] = $request['cityId'];
        }

        if (isset($request['customerUserId']) && !empty($request['customerUserId'])) {
            $sql .= " AND tsv.userId = :customerUserId";
            $bind[':customerUserId'] = $request['customerUserId'];
        }
    }
}