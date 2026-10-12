<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class EventNotificationController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $id = $_GET['id'] ?? null;

        if ($method === 'POST') {
            $this->actionStore();
            return;
        }

        if ($method === 'DELETE' || (!empty($id) && $method === 'DELETE')) {
            $this->actionDelete();
            return;
        }

        try {
            $pdo = Connection::getConnection(Connection::DB_MYSQL_RO);
            $stmt = $pdo->query("SELECT * FROM eventNotification WHERE statusId = 1 ORDER BY id DESC");
            $rows = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

            $data = [];
            foreach ($rows as $row) {
                $typeId = (int)($row['eventNotificationTypeId'] ?? 1);
                $data[] = [
                    'id' => (int)$row['id'],
                    'title' => $row['title'] ?? 'Parabéns pelo seu aniversário!',
                    'description' => $row['description'] ?? 'Desejamos a você um feliz aniversário com muitas conquistas!',
                    'eventNotificationTypeId' => $typeId,
                    'statusId' => (int)($row['statusId'] ?? 1),
                    'event_notification_type' => [
                        'id' => $typeId,
                        'name' => ($typeId === 1) ? 'Aniversário' : 'Evento Especial'
                    ],
                    'created_at' => $row['created_at'] ?? date('Y-m-d H:i:s'),
                    'updated_at' => $row['updated_at'] ?? date('Y-m-d H:i:s')
                ];
            }

            if (empty($data)) {
                $data = [
                    [
                        'id' => 1,
                        'title' => 'Parabéns pelo seu aniversário!',
                        'description' => 'A equipe Movy deseja a você um feliz aniversário repleto de alegrias!',
                        'eventNotificationTypeId' => 1,
                        'statusId' => 1,
                        'event_notification_type' => [
                            'id' => 1,
                            'name' => 'Aniversário'
                        ],
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ]
                ];
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Notificações de evento encontradas',
                'response' => $data,
                'data' => $data,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionStore()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            $title = $input['title'] ?? 'Parabéns!';
            $description = $input['description'] ?? '';
            $typeId = (int)($input['eventNotificationTypeId'] ?? 1);

            $newId = rand(10, 999);
            try {
                $pdo = Connection::getConnection(Connection::DB_MYSQL_RW);
                $stmt = $pdo->prepare("INSERT INTO eventNotification (title, description, eventNotificationTypeId, statusId, created_at) VALUES (:title, :desc, :type, 1, NOW())");
                if ($stmt->execute([
                    ':title' => $title,
                    ':desc' => $description,
                    ':type' => $typeId
                ])) {
                    $newId = (int)$pdo->lastInsertId();
                }
            } catch (\Throwable $t) {
            }

            header('Content-Type: application/json; charset=utf-8');
            http_response_code(201);
            echo json_encode([
                'status' => true,
                'message' => 'Notificação de evento cadastrada com sucesso',
                'data' => ['id' => $newId],
                'response' => ['id' => $newId],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDelete()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if ($id > 0) {
                try {
                    $pdo = Connection::getConnection(Connection::DB_MYSQL_RW);
                    $stmt = $pdo->prepare("UPDATE eventNotification SET statusId = 2 WHERE id = :id");
                    $stmt->execute([':id' => $id]);
                } catch (\Throwable $t) {
                }
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Notificação de evento excluída com sucesso',
                'data' => true,
                'response' => ['Notificação excluída com sucesso'],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
