<?php

namespace app\controllers;

use app\utils\BaseDao;
use Exception;

class ReportController extends ApiController
{
    public function actionSelectDriverRegisterStatus()
    {
        try {
            $dao = new BaseDao();
            $rows = $dao->sqlRawSelect("SELECT idDriverRegisterStatus AS id, name, description FROM driverRegisterStatus ORDER BY idDriverRegisterStatus ASC")->get();
            if (!is_array($rows)) {
                $rows = [];
            } else {
                foreach ($rows as &$r) {
                    $r['id'] = (int)$r['id'];
                }
            }

            echo $this->returnSuccess("Status de cadastro de motoristas", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDriverSynthetic()
    {
        try {
            $dao = new BaseDao();
            $dateStart = isset($_GET['dateStart']) ? $_GET['dateStart'] . " 00:00:00" : date('Y-m-d 00:00:00', strtotime('-30 days'));
            $dateEnd = isset($_GET['dateEnd']) ? $_GET['dateEnd'] . " 23:59:59" : date('Y-m-d 23:59:59');

            $cities = isset($_GET['cities']) && is_array($_GET['cities']) ? array_filter($_GET['cities']) : [];
            $drivers = isset($_GET['drivers']) && is_array($_GET['drivers']) ? array_filter($_GET['drivers']) : [];

            $where = [
                "t.statusTripId = 2", // finalizada
                "t.dateInitTrip >= :dateStart",
                "t.dateInitTrip <= :dateEnd"
            ];
            $params = [
                ':dateStart' => $dateStart,
                ':dateEnd' => $dateEnd
            ];

            if (!empty($cities)) {
                $cityPlaceholders = [];
                foreach ($cities as $idx => $cId) {
                    $key = ":city_" . $idx;
                    $cityPlaceholders[] = $key;
                    $params[$key] = (int)$cId;
                }
                $where[] = "t.cityId IN (" . implode(",", $cityPlaceholders) . ")";
            }

            if (!empty($drivers)) {
                $driverPlaceholders = [];
                foreach ($drivers as $idx => $dId) {
                    $key = ":driver_" . $idx;
                    $driverPlaceholders[] = $key;
                    $params[$key] = (int)$dId;
                }
                $where[] = "t.driverId IN (" . implode(",", $driverPlaceholders) . ")";
            }

            $whereStr = implode(" AND ", $where);

            $sql = "SELECT t.driverId,
                           u.name AS driverName,
                           u.phone AS driverPhone,
                           ci.name AS cityName,
                           COUNT(t.idTrip) AS totalTrips,
                           COALESCE(SUM(t.tripPrice), 0) AS grossTotal,
                           COALESCE(SUM(t.appPrice), 0) AS appFeeTotal,
                           COALESCE(SUM(t.tripPrice - t.appPrice), 0) AS netTotal
                    FROM trip t
                    INNER JOIN driver d ON d.idDriver = t.driverId
                    INNER JOIN user u ON u.idUser = d.userId
                    LEFT JOIN city ci ON ci.idCity = t.cityId
                    WHERE {$whereStr}
                    GROUP BY t.driverId, u.name, u.phone, ci.name
                    ORDER BY grossTotal DESC";

            $rows = $dao->sqlRawSelect($sql, $params)->get();
            $result = [];

            if (is_array($rows)) {
                foreach ($rows as $r) {
                    $result[] = [
                        'driverId' => (int)$r['driverId'],
                        'driverName' => $r['driverName'],
                        'driverPhone' => $r['driverPhone'],
                        'cityName' => $r['cityName'],
                        'totalTrips' => (int)$r['totalTrips'],
                        'grossTotal' => (float)$r['grossTotal'],
                        'appFeeTotal' => (float)$r['appFeeTotal'],
                        'netTotal' => (float)$r['netTotal']
                    ];
                }
            }

            echo $this->returnSuccess("Relatório sintético de motoristas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao gerar relatório sintético de motoristas");
        }
    }
}
