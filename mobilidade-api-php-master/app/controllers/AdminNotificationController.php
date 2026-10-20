<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class AdminNotificationController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];

            if ($method === 'GET') {
                $page = isset($_GET['page']) && (int)$_GET['page'] > 0 ? (int)$_GET['page'] : 1;
                $typeId = isset($_GET['adminNotificationTypeId']) && (int)$_GET['adminNotificationTypeId'] > 0 ? (int)$_GET['adminNotificationTypeId'] : null;
                $limit = 15;
                $offset = ($page - 1) * $limit;

                $where = [];
                $params = [];

                if ($typeId) {
                    $where[] = "n.adminNotificationTypeId = :typeId";
                    $params[':typeId'] = $typeId;
                }

                $whereStr = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

                $countRow = GenericDao::first("SELECT COUNT(*) AS total FROM adminNotification n {$whereStr}", $params);
                $total = $countRow ? (int)$countRow['total'] : 0;
                $lastPage = $total > 0 ? (int)ceil($total / $limit) : 1;

                $sql = "SELECT n.id,
                               n.adminNotificationTypeId,
                               n.title,
                               n.message,
                               n.userId,
                               n.read,
                               n.created_at,
                               u.name AS user_name,
                               u.phone AS user_phone,
                               d.idDriver AS driver_idDriver
                        FROM adminNotification n
                        LEFT JOIN user u ON u.idUser = n.userId
                        LEFT JOIN driver d ON d.userId = n.userId
                        {$whereStr}
                        ORDER BY n.id DESC
                        LIMIT {$limit} OFFSET {$offset}";

                $rows = GenericDao::query($sql, $params);
                $data = [];

                foreach ($rows as $row) {
                    $item = [
                        'id' => (int)$row['id'],
                        'adminNotificationTypeId' => (int)$row['adminNotificationTypeId'],
                        'title' => $row['title'],
                        'message' => $row['message'],
                        'read' => (int)$row['read'],
                        'created_at' => $row['created_at'] ? date('c', strtotime($row['created_at'])) : date('c'),
                        'user' => [
                            'name' => $row['user_name'] ?? 'Usuário',
                            'phone' => $row['user_phone'] ?? ''
                        ]
                    ];

                    if (!empty($row['driver_idDriver'])) {
                        $item['driver'] = [
                            'idDriver' => (int)$row['driver_idDriver']
                        ];
                    }

                    $data[] = $item;
                }

                $response = [
                    'data' => $data,
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'per_page' => $limit,
                    'total' => $total
                ];

                echo $this->returnSuccess("Notificações administrativas", $response);
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar notificações administrativas");
        }
    }

    public function actionRead()
    {
        try {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) {
                throw new Exception("ID da notificação não informado.");
            }

            GenericDao::execute("UPDATE adminNotification SET `read` = 1, updated_at = NOW() WHERE id = :id", [':id' => $id]);

            echo $this->returnSuccess("Notificação marcada como lida");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
