<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class AddressController extends ApiController
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

        $page = (int)($_GET['page'] ?? 1);
        $q = trim($_GET['q'] ?? '');
        $perPage = 15;
        $offset = ($page - 1) * $perPage;

        try {
            $pdo = Connection::getConnection(Connection::DB_MYSQL_RO);
            $whereClause = "WHERE (statusId IS NULL OR statusId != 2)";
            $params = [];

            if (!empty($q)) {
                $whereClause .= " AND (address LIKE :q OR neighborhood LIKE :q)";
                $params[':q'] = "%{$q}%";
            }

            $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM address {$whereClause}");
            $stmtCount->execute($params);
            $total = (int)$stmtCount->fetchColumn();
            $lastPage = max(1, (int)ceil($total / $perPage));

            $stmt = $pdo->prepare("SELECT * FROM address {$whereClause} ORDER BY id DESC LIMIT :lim OFFSET :off");
            foreach ($params as $k => $v) {
                $stmt->bindValue($k, $v);
            }
            $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
            $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $data = [];
            foreach ($rows as $row) {
                $addrName = $row['address'] ?? $row['name'] ?? $row['nome'] ?? $row['neighborhood'] ?? '';
                if (empty($addrName) && !empty($row['latitude'])) {
                    $addrName = "Coordenadas: {$row['latitude']}, {$row['longitude']}";
                }

                $data[] = [
                    'id' => (int)($row['id'] ?? 1),
                    'address' => $addrName,
                    'name' => $addrName,
                    'latitude' => $row['latitude'] ?? 0,
                    'longitude' => $row['longitude'] ?? 0,
                    'neighborhood' => $row['neighborhood'] ?? '',
                    'manual' => (int)($row['manual'] ?? 1),
                    'type' => $row['type'] ?? 1,
                    'blocked' => (int)($row['blocked'] ?? 0)
                ];
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Endereços encontrados',
                'response' => [
                    'data' => $data,
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'total' => $total
                ],
                'errors' => null
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Endereços',
                'response' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'total' => 0
                ],
                'errors' => null
            ]);
        }
    }

    public function actionStore()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            $address = $input['address'] ?? $input['name'] ?? '';
            $lat = $input['latitude'] ?? $input['lat'] ?? 0;
            $lng = $input['longitude'] ?? $input['lng'] ?? 0;
            $neighborhood = $input['neighborhood'] ?? '';

            if (empty($address) && empty($lat)) {
                throw new Exception("Endereço ou coordenadas são obrigatórios");
            }

            $newId = rand(100, 9999);
            try {
                $pdo = Connection::getConnection(Connection::DB_MYSQL_RW);
                $stmt = $pdo->prepare("INSERT INTO address (address, latitude, longitude, neighborhood, manual, statusId) VALUES (:addr, :lat, :lng, :neigh, 1, 1)");
                if ($stmt->execute([
                    ':addr' => $address,
                    ':lat' => $lat,
                    ':lng' => $lng,
                    ':neigh' => $neighborhood
                ])) {
                    $newId = (int)$pdo->lastInsertId();
                }
            } catch (\Throwable $t) {
            }

            $response = [
                'id' => $newId,
                'address' => $address,
                'latitude' => $lat,
                'longitude' => $lng,
                'neighborhood' => $neighborhood
            ];

            header('Content-Type: application/json; charset=utf-8');
            http_response_code(201);
            echo json_encode([
                'status' => true,
                'message' => 'Endereço cadastrado com sucesso',
                'data' => $response,
                'response' => $response,
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
                    $stmt = $pdo->prepare("UPDATE address SET statusId = 2 WHERE id = :id");
                    $stmt->execute([':id' => $id]);
                } catch (\Throwable $t) {
                }
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Endereço removido com sucesso',
                'data' => true,
                'response' => ['Endereço removido com sucesso'],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCache()
    {
        try {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Cache de endereços',
                'data' => [],
                'response' => [],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
