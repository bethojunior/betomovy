<?php

namespace app\controllers;
use app\services\DynamicAreaService;
use Exception;

class DynamicAreaController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'POST') {
            $this->actionStore();
            return;
        }

        if ($method === 'PUT') {
            $this->actionUpdate();
            return;
        }

        if ($method === 'DELETE') {
            $this->actionDelete();
            return;
        }

        try {
            $cityId = (int)($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0));
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $stmt = $pdo->prepare("
                SELECT 
                    id,
                    name,
                    multiplierValue,
                    cityId,
                    active,
                    startTime,
                    endTime,
                    created_at,
                    updated_at
                FROM dynamicArea
                WHERE (cityId = :cityId OR :cityIdZero = 0)
                  AND deleted_at IS NULL
                ORDER BY id DESC
            ");
            $stmt->execute([':cityId' => $cityId, ':cityIdZero' => $cityId]);
            $list = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Áreas dinâmicas encontradas',
                'data' => $list,
                'response' => $list,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Áreas dinâmicas vazias',
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

            $name = $body['name'] ?? 'Nova Área';
            $cityId = (int)($body['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 1));
            $multiplierValue = (float)($body['multiplierValue'] ?? 1.0);
            $startTime = !empty($body['startTime']) ? $body['startTime'] : null;
            $endTime = !empty($body['endTime']) ? $body['endTime'] : null;
            $areaPoints = $body['area'] ?? [];

            // Constrói POLYGON WKT se houver pontos
            $polygonSql = "ST_GeomFromText('POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))')";
            if (is_array($areaPoints) && count($areaPoints) >= 3) {
                $coords = [];
                foreach ($areaPoints as $pt) {
                    $coords[] = ($pt['lng'] ?? $pt[0]) . ' ' . ($pt['lat'] ?? $pt[1]);
                }
                // Fecha o polígono se necessário
                if ($coords[0] !== end($coords)) {
                    $coords[] = $coords[0];
                }
                $polygonSql = "ST_GeomFromText('POLYGON((" . implode(',', $coords) . "))')";
            }

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("
                INSERT INTO dynamicArea 
                (name, area, multiplierValue, cityId, active, startTime, endTime, created_at)
                VALUES 
                (:name, {$polygonSql}, :multiplierValue, :cityId, 1, :startTime, :endTime, NOW())
            ");
            $stmt->execute([
                ':name' => $name,
                ':multiplierValue' => $multiplierValue,
                ':cityId' => $cityId,
                ':startTime' => $startTime,
                ':endTime' => $endTime
            ]);

            $id = $pdo->lastInsertId();

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Área dinâmica criada com sucesso',
                'data' => ['id' => $id],
                'response' => ['id' => $id],
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao criar área dinâmica: ' . $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => null
            ]);
        }
    }

    public function actionUpdate()
    {
        try {
            $raw = file_get_contents('php://input');
            $body = json_decode($raw, true) ?: $_POST;
            $id = (int)($_GET['id'] ?? ($body['id'] ?? 0));

            $cityId = (int)($body['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 1));
            $multiplierValue = (float)($body['multiplierValue'] ?? 1.0);
            $startTime = !empty($body['startTime']) ? $body['startTime'] : null;
            $endTime = !empty($body['endTime']) ? $body['endTime'] : null;

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("
                UPDATE dynamicArea 
                SET multiplierValue = :multiplierValue, startTime = :startTime, endTime = :endTime, updated_at = NOW()
                WHERE id = :id
            ");
            $stmt->execute([
                ':id' => $id,
                ':multiplierValue' => $multiplierValue,
                ':startTime' => $startTime,
                ':endTime' => $endTime
            ]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Área dinâmica editada com sucesso',
                'data' => true,
                'response' => true,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao editar área dinâmica: ' . $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => null
            ]);
        }
    }

    public function actionDisable()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("UPDATE dynamicArea SET active = 0, updated_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Área desativada com sucesso',
                'data' => true,
                'response' => true,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao desativar área: ' . $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => null
            ]);
        }
    }

    public function actionEnable()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("UPDATE dynamicArea SET active = 1, updated_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Área ativada com sucesso',
                'data' => true,
                'response' => true,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao ativar área: ' . $e->getMessage(),
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
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("UPDATE dynamicArea SET deleted_at = NOW(), active = 0 WHERE id = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Área dinâmica excluída com sucesso',
                'data' => true,
                'response' => true,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao excluir área dinâmica',
                'data' => null,
                'response' => null,
                'errors' => null
            ]);
        }
    }

    public function actionFindAll()
    {
        $request = $this->requestQuery();
        try {
            echo $this->returnSuccess("Dinamica por área",
                (new DynamicAreaService)->findAllByPosition($request->lat, $request->lng, $request->timeCurrent ?? null)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar dinamica por área");
        }
    }
}