<?php

namespace app\controllers;

use Exception;

class PriceDynamicScheduledController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'POST') {
            $this->actionStore();
            return;
        }

        if ($method === 'DELETE') {
            $this->actionDelete();
            return;
        }

        try {
            $cityId = (int)($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0));
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            // Ensure table exists
            try {
                $pdo->exec("
                    CREATE TABLE IF NOT EXISTS priceDynamicScheduled (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        cityId INT NOT NULL DEFAULT 1,
                        tripTypeId INT NOT NULL DEFAULT 1,
                        multiplierValue DECIMAL(10,2) NOT NULL DEFAULT 1.00,
                        tag VARCHAR(255) NULL,
                        startDate DATETIME NULL,
                        endDate DATETIME NULL,
                        startDateUTC DATETIME NULL,
                        endDateUTC DATETIME NULL,
                        statusId INT NOT NULL DEFAULT 1,
                        created_at DATETIME NULL,
                        updated_at DATETIME NULL
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                ");
            } catch (\Throwable $t) {}

            $stmt = $pdo->prepare("
                SELECT 
                    pds.id,
                    pds.cityId,
                    c.nome as city,
                    pds.tripTypeId,
                    tt.type as tripType,
                    pds.multiplierValue,
                    pds.tag,
                    pds.startDate,
                    pds.endDate,
                    pds.statusId
                FROM priceDynamicScheduled pds
                LEFT JOIN city c ON pds.cityId = c.id
                LEFT JOIN tripType tt ON pds.tripTypeId = tt.idTripType
                WHERE (pds.cityId = :cityId OR :cityIdZero = 0)
                  AND pds.statusId = 1
                ORDER BY pds.id DESC
            ");
            $stmt->execute([':cityId' => $cityId, ':cityIdZero' => $cityId]);
            $list = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Gatilhos de dinâmica encontrados',
                'data' => $list,
                'response' => $list,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Gatilhos de dinâmica vazios',
                'data' => [],
                'response' => [],
                'errors' => null
            ]);
        }
    }

    public function actionStore()
    {
        try {
            $raw = file_get_contents('php://input');
            $body = json_decode($raw, true) ?: $_POST;

            $cityId = (int)($body['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 1));
            $tripTypeIds = (array)($body['tripTypeId'] ?? [1]);
            $multiplierValue = (float)($body['multiplierValue'] ?? 1.0);
            $startDate = $body['startDate'] ?? date('Y-m-d H:i:s');
            $endDate = $body['endDate'] ?? date('Y-m-d H:i:s', strtotime('+1 day'));
            $tag = $body['tag'] ?? '';

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $stmt = $pdo->prepare("
                INSERT INTO priceDynamicScheduled 
                (cityId, tripTypeId, multiplierValue, tag, startDate, endDate, statusId, created_at)
                VALUES 
                (:cityId, :tripTypeId, :multiplierValue, :tag, :startDate, :endDate, 1, NOW())
            ");

            $results = [];
            foreach ($tripTypeIds as $tid) {
                $stmt->execute([
                    ':cityId' => $cityId,
                    ':tripTypeId' => (int)$tid,
                    ':multiplierValue' => $multiplierValue,
                    ':tag' => $tag,
                    ':startDate' => $startDate,
                    ':endDate' => $endDate
                ]);
                $results[] = [
                    'id' => $pdo->lastInsertId(),
                    'cityId' => $cityId,
                    'tripTypeId' => $tid,
                    'multiplierValue' => $multiplierValue
                ];
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Gatilhos de dinâmica inseridos com sucesso',
                'data' => $results,
                'response' => $results,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao inserir gatilhos: ' . $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => null
            ]);
        }
    }

    public function actionDelete()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if ($id > 0) {
                $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
                $stmt = $pdo->prepare("UPDATE priceDynamicScheduled SET statusId = 2 WHERE id = :id");
                $stmt->execute([':id' => $id]);
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Gatilho excluído com sucesso',
                'data' => true,
                'response' => true,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao excluir gatilho',
                'data' => null,
                'response' => null,
                'errors' => null
            ]);
        }
    }
}
