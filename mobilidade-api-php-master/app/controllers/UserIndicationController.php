<?php

namespace app\controllers;

use app\dao\GenericDao;
use app\services\UserIndicationService;
use app\utils\Headers;
use Exception;

class UserIndicationController extends ApiController
{
    public function actionGetIndicated()
    {
        try {
            echo $this->returnSuccess(
                "Listando usuários indicados",
                (new UserIndicationService)
                    ->getIndicated(Headers::getUserId(), $this->requestQuery()));
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao listar usuários indicados');
        }
    }

    public function actionReportReferredUsers()
    {
        try {
            $name = isset($_GET['name']) ? trim($_GET['name']) : '';

            $where = ["ui.statusId = 1"];
            $params = [];

            if (!empty($name)) {
                $where[] = "(u_who.name LIKE :name OR u_ind.name LIKE :name)";
                $params[':name'] = "%{$name}%";
            }

            $whereStr = implode(" AND ", $where);
            $sql = "SELECT ui.id,
                           ui.whoIndicatedId,
                           ui.userIndicatedId,
                           ui.created_at,
                           u_who.name AS whoIndicatedName,
                           u_who.phone AS whoIndicatedPhone,
                           u_ind.name AS indicatedUserName,
                           u_ind.phone AS indicatedUserPhone
                    FROM userIndication ui
                    LEFT JOIN user u_who ON u_who.idUser = ui.whoIndicatedId
                    LEFT JOIN user u_ind ON u_ind.idUser = ui.userIndicatedId
                    WHERE {$whereStr}
                    ORDER BY ui.id DESC
                    LIMIT 100";

            $rows = GenericDao::query($sql, $params);
            $result = is_array($rows) ? $rows : [];

            echo $this->returnSuccess("Usuários indicados", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar usuários indicados");
        }
    }

    public function actionReportReferralEarnings()
    {
        try {
            $dateStart = isset($_GET['dateStart']) ? $_GET['dateStart'] . " 00:00:00" : date('Y-m-d 00:00:00', strtotime('-30 days'));
            $dateEnd = isset($_GET['dateEnd']) ? $_GET['dateEnd'] . " 23:59:59" : date('Y-m-d 23:59:59');
            $userId = isset($_GET['userId']) && !empty($_GET['userId']) ? (int)$_GET['userId'] : null;

            $where = [
                "bf.balanceFlowTypeId = 5",
                "bf.created_at >= :dateStart",
                "bf.created_at <= :dateEnd"
            ];
            $params = [
                ':dateStart' => $dateStart,
                ':dateEnd' => $dateEnd
            ];

            if ($userId) {
                $where[] = "b.userId = :userId";
                $params[':userId'] = $userId;
            }

            $whereStr = implode(" AND ", $where);
            $sql = "SELECT bf.idBalanceFlow AS id,
                           bf.value,
                           bf.created_at,
                           b.userId,
                           u.name AS userName,
                           u.phone AS userPhone
                    FROM balanceFlow bf
                    INNER JOIN balance b ON b.idBalance = bf.balanceId
                    INNER JOIN user u ON u.idUser = b.userId
                    WHERE {$whereStr}
                    ORDER BY bf.idBalanceFlow DESC
                    LIMIT 200";

            $rows = GenericDao::query($sql, $params);
            $result = [];

            foreach ($rows as $r) {
                $result[] = [
                    'id' => (int)$r['id'],
                    'value' => (float)$r['value'],
                    'created_at' => $r['created_at'],
                    'userId' => (int)$r['userId'],
                    'userName' => $r['userName'],
                    'userPhone' => $r['userPhone']
                ];
            }

            echo $this->returnSuccess("Ganhos por indicação", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar ganhos por indicação");
        }
    }
}
