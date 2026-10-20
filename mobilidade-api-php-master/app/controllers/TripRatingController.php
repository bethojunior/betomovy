<?php

namespace app\controllers;

use app\dao\GenericDao;
use app\services\TripRatingService;
use Exception;

class TripRatingController extends ApiController
{
    public function actionIndex()
    {
        try {
            $driverId = isset($_GET['driverId']) && !empty($_GET['driverId']) ? (int)$_GET['driverId'] : null;
            $ratedUser = isset($_GET['ratedUser']) && !empty($_GET['ratedUser']) ? (int)$_GET['ratedUser'] : null;

            $where = ["tr.statusId = 1"];
            $params = [];

            if ($driverId) {
                $driverRow = GenericDao::first("SELECT userId FROM driver WHERE idDriver = :driverId", [':driverId' => $driverId]);
                if ($driverRow && !empty($driverRow['userId'])) {
                    $where[] = "tr.ratedUser = :userId";
                    $params[':userId'] = (int)$driverRow['userId'];
                } else {
                    $where[] = "tr.ratedUser = :driverId";
                    $params[':driverId'] = $driverId;
                }
            } elseif ($ratedUser) {
                $where[] = "tr.ratedUser = :ratedUser";
                $params[':ratedUser'] = $ratedUser;
            }

            $whereStr = implode(" AND ", $where);
            $sql = "SELECT tr.idTripRating,
                           tr.tripReference,
                           tr.ratedUser,
                           tr.userWhoEvaluated,
                           tr.rating,
                           tr.comment,
                           tr.created_at,
                           u.name AS evaluatorName
                    FROM tripRating tr
                    LEFT JOIN user u ON u.idUser = tr.userWhoEvaluated
                    WHERE {$whereStr}
                    ORDER BY tr.idTripRating DESC
                    LIMIT 100";

            $rows = GenericDao::query($sql, $params);
            $result = [];

            foreach ($rows as $row) {
                $result[] = [
                    'idTripRating' => (int)$row['idTripRating'],
                    'tripReference' => $row['tripReference'],
                    'rating' => (int)$row['rating'],
                    'comment' => $row['comment'] ?? '',
                    'created_at' => $row['created_at'],
                    'evaluatorName' => $row['evaluatorName'] ?? 'Passageiro'
                ];
            }

            echo $this->returnSuccess("Avaliações encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar avaliações");
        }
    }

    public function actionRate()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Viagem avaliada",
                (new TripRatingService)->rate($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao avaliar a viagem');
        }
    }
}
