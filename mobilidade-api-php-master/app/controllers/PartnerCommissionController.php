<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class PartnerCommissionController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

        // Check if method is overridden via _method
        if ($method === 'POST' && isset($_POST['_method'])) {
            $method = strtoupper($_POST['_method']);
        }

        switch ($method) {
            case 'POST':
                $this->handleStore();
                break;
            case 'PUT':
                $this->handleUpdate();
                break;
            case 'DELETE':
                $this->handleDelete();
                break;
            case 'GET':
            default:
                $this->handleList();
                break;
        }
    }

    private function ensureColumns(PDO $pdo)
    {
        try {
            $stmt = $pdo->query("SHOW COLUMNS FROM partnerCommission");
            $existingCols = $stmt->fetchAll(PDO::FETCH_COLUMN);

            if (!in_array('cityId', $existingCols)) {
                $pdo->exec("ALTER TABLE partnerCommission ADD COLUMN cityId INT NULL");
            }
            if (!in_array('tripTypeId', $existingCols)) {
                $pdo->exec("ALTER TABLE partnerCommission ADD COLUMN tripTypeId INT NULL");
            }
            if (!in_array('statusId', $existingCols)) {
                $pdo->exec("ALTER TABLE partnerCommission ADD COLUMN statusId INT NOT NULL DEFAULT 1");
            }
            if (!in_array('created_at', $existingCols)) {
                $pdo->exec("ALTER TABLE partnerCommission ADD COLUMN created_at DATETIME NULL");
            }
            if (!in_array('updated_at', $existingCols)) {
                $pdo->exec("ALTER TABLE partnerCommission ADD COLUMN updated_at DATETIME NULL");
            }
        } catch (\Throwable $e) {
            // Silently continue if error or already exists
        }
    }

    private function handleList()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $this->ensureColumns($pdo);

            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id > 0) {
                $stmt = $pdo->prepare("
                    SELECT 
                        pc.*,
                        c.nome AS cityName,
                        tt.type AS tripTypeName
                    FROM partnerCommission pc
                    LEFT JOIN city c ON c.cityId = pc.cityId
                    LEFT JOIN tripType tt ON tt.idTripType = pc.tripTypeId
                    WHERE pc.id = :id
                    LIMIT 1
                ");
                $stmt->execute([':id' => $id]);
                $row = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($row) {
                    $item = [
                        'id' => (int)$row['id'],
                        'cityId' => !empty($row['cityId']) ? (int)$row['cityId'] : null,
                        'tripTypeId' => !empty($row['tripTypeId']) ? (int)$row['tripTypeId'] : null,
                        'partnerCommissionType' => $row['partnerCommissionType'] ?? '%',
                        'partnerCommissionValue' => (float)($row['partnerCommissionValue'] ?? 0),
                        'trip_type' => [
                            'idTripType' => !empty($row['tripTypeId']) ? (int)$row['tripTypeId'] : null,
                            'type' => $row['tripTypeName'] ?? 'Padrão'
                        ],
                        'city' => [
                            'cityId' => !empty($row['cityId']) ? (int)$row['cityId'] : null,
                            'nome' => $row['cityName'] ?? 'Todas'
                        ]
                    ];

                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode(['status' => true, 'response' => $item, 'data' => $item]);
                    return;
                }
            }

            $stmt = $pdo->query("
                SELECT 
                    pc.*,
                    c.nome AS cityName,
                    tt.type AS tripTypeName
                FROM partnerCommission pc
                LEFT JOIN city c ON c.cityId = pc.cityId
                LEFT JOIN tripType tt ON tt.idTripType = pc.tripTypeId
                WHERE (pc.statusId = 1 OR pc.statusId IS NULL)
                ORDER BY pc.id DESC
            ");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $list = [];
            foreach ($rows as $r) {
                $list[] = [
                    'id' => (int)$r['id'],
                    'cityId' => !empty($r['cityId']) ? (int)$r['cityId'] : null,
                    'tripTypeId' => !empty($r['tripTypeId']) ? (int)$r['tripTypeId'] : null,
                    'partnerCommissionType' => $r['partnerCommissionType'] ?? '%',
                    'partnerCommissionValue' => (float)($r['partnerCommissionValue'] ?? 0),
                    'trip_type' => [
                        'idTripType' => !empty($r['tripTypeId']) ? (int)$r['tripTypeId'] : null,
                        'type' => $r['tripTypeName'] ?? 'Padrão'
                    ],
                    'city' => [
                        'cityId' => !empty($r['cityId']) ? (int)$r['cityId'] : null,
                        'nome' => $r['cityName'] ?? 'Todas'
                    ]
                ];
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Comissões encontradas',
                'response' => $list,
                'data' => $list
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao listar comissões: ' . $e->getMessage(),
                'response' => [],
                'data' => []
            ]);
        }
    }

    private function handleStore()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $this->ensureColumns($pdo);

            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true) ?: $_POST;

            $cityId = !empty($data['cityId']) ? (int)$data['cityId'] : null;
            $tripTypeId = !empty($data['tripTypeId']) ? (int)$data['tripTypeId'] : null;
            $type = $data['partnerCommissionType'] ?? '%';
            $value = (float)($data['partnerCommissionValue'] ?? 0);

            if ($value <= 0) {
                throw new Exception("Valor da comissão deve ser maior que zero");
            }

            $stmt = $pdo->prepare("
                INSERT INTO partnerCommission (partnerCommissionType, partnerCommissionValue, cityId, tripTypeId, statusId, created_at, updated_at)
                VALUES (:pct, :pcv, :cid, :ttid, 1, NOW(), NOW())
            ");
            $stmt->execute([
                ':pct' => $type,
                ':pcv' => $value,
                ':cid' => $cityId,
                ':ttid' => $tripTypeId
            ]);

            $id = (int)$pdo->lastInsertId();

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Comissão cadastrada com sucesso',
                'response' => ['id' => $id],
                'data' => ['id' => $id]
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao cadastrar comissão: ' . $e->getMessage(),
                'response' => null,
                'data' => null
            ]);
        }
    }

    private function handleUpdate()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $this->ensureColumns($pdo);

            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true) ?: $_POST;

            if ($id <= 0 && !empty($data['id'])) {
                $id = (int)$data['id'];
            }

            if ($id <= 0) {
                throw new Exception("ID da comissão não informado");
            }

            $cityId = !empty($data['cityId']) ? (int)$data['cityId'] : null;
            $tripTypeId = !empty($data['tripTypeId']) ? (int)$data['tripTypeId'] : null;
            $type = $data['partnerCommissionType'] ?? '%';
            $value = (float)($data['partnerCommissionValue'] ?? 0);

            if ($value <= 0) {
                throw new Exception("Valor da comissão deve ser maior que zero");
            }

            $stmt = $pdo->prepare("
                UPDATE partnerCommission 
                SET partnerCommissionType = :pct,
                    partnerCommissionValue = :pcv,
                    cityId = :cid,
                    tripTypeId = :ttid,
                    updated_at = NOW()
                WHERE id = :id
            ");
            $stmt->execute([
                ':pct' => $type,
                ':pcv' => $value,
                ':cid' => $cityId,
                ':ttid' => $tripTypeId,
                ':id' => $id
            ]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Comissão atualizada com sucesso',
                'response' => true,
                'data' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao atualizar comissão: ' . $e->getMessage(),
                'response' => false,
                'data' => false
            ]);
        }
    }

    private function handleDelete()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $this->ensureColumns($pdo);

            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id <= 0) {
                $raw = file_get_contents('php://input');
                $data = json_decode($raw, true) ?: $_POST;
                $id = (int)($data['id'] ?? 0);
            }

            if ($id <= 0) {
                throw new Exception("ID da comissão não informado");
            }

            $stmt = $pdo->prepare("UPDATE partnerCommission SET statusId = 2, updated_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Comissão removida com sucesso',
                'response' => true,
                'data' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao remover comissão: ' . $e->getMessage(),
                'response' => false,
                'data' => false
            ]);
        }
    }
}
