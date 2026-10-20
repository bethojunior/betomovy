<?php

namespace app\controllers;

use app\dao\GenericDao;
use app\utils\Connection;
use Exception;
use PDO;

class MonitoringAreaController extends ApiController
{
    /**
     * GET /monitoringArea
     * POST /monitoringArea
     */
    public function actionIndex()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        if ($method === 'POST') {
            return $this->actionStore();
        }

        try {
            $pdo = Connection::open();
            $cityId = $_GET['cityId'] ?? $_SERVER['HTTP_CITYID'] ?? null;

            if ($cityId) {
                $stmt = $pdo->prepare("SELECT * FROM monitoring_point_area WHERE cityId = :cityId ORDER BY id DESC");
                $stmt->execute([':cityId' => (int)$cityId]);
            } else {
                $stmt = $pdo->query("SELECT * FROM monitoring_point_area ORDER BY id DESC");
            }

            $rows = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
            $results = array_map(function ($row) {
                if (isset($row['area']) && is_string($row['area'])) {
                    $decoded = json_decode($row['area'], true);
                    $row['area'] = $decoded !== null ? $decoded : [];
                }
                $row['id'] = (int)($row['id'] ?? 0);
                $row['cityId'] = (int)($row['cityId'] ?? 0);
                $row['active'] = (int)($row['active'] ?? 1);
                return $row;
            }, $rows);

            echo $this->returnSuccess("Lista de áreas de monitoramento", $results);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * POST /monitoringArea
     */
    public function actionStore()
    {
        try {
            $request = $this->request();
            $pdo = Connection::open();

            $name = trim($request['name'] ?? 'Área de Monitoramento');
            $cityId = (int)($request['cityId'] ?? $_SERVER['HTTP_CITYID'] ?? 5695);
            $active = isset($request['active']) ? (int)$request['active'] : 1;
            
            $area = $request['area'] ?? [];
            $areaJson = is_string($area) ? $area : json_encode($area);

            $stmt = $pdo->prepare("
                INSERT INTO monitoring_point_area (name, cityId, area, active, created_at, updated_at)
                VALUES (:name, :cityId, :area, :active, NOW(), NOW())
            ");
            $stmt->execute([
                ':name' => $name,
                ':cityId' => $cityId,
                ':area' => $areaJson,
                ':active' => $active
            ]);

            $id = (int)$pdo->lastInsertId();

            echo $this->returnSuccess("Área de monitoramento criada com sucesso", [
                'id' => $id,
                'name' => $name,
                'cityId' => $cityId,
                'area' => is_array($area) ? $area : json_decode($areaJson, true),
                'active' => $active
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * PUT /monitoringArea/{id} or /monitoringArea/{id}/update
     */
    public function actionUpdate()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if (!$id) {
                throw new Exception("ID da área não informado");
            }

            $request = $this->request();
            $pdo = Connection::open();

            $fields = ["updated_at = NOW()"];
            $params = [':id' => $id];

            if (isset($request['name'])) {
                $fields[] = "name = :name";
                $params[':name'] = trim($request['name']);
            }
            if (isset($request['cityId'])) {
                $fields[] = "cityId = :cityId";
                $params[':cityId'] = (int)$request['cityId'];
            }
            if (isset($request['active'])) {
                $fields[] = "active = :active";
                $params[':active'] = (int)$request['active'];
            }
            if (isset($request['area'])) {
                $fields[] = "area = :area";
                $params[':area'] = is_string($request['area']) ? $request['area'] : json_encode($request['area']);
            }

            $setSql = implode(', ', $fields);
            $stmt = $pdo->prepare("UPDATE monitoring_point_area SET {$setSql} WHERE id = :id");
            $stmt->execute($params);

            echo $this->returnSuccess("Área de monitoramento atualizada com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * PUT /monitoringArea/{id}/enable
     */
    public function actionEnable()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if (!$id) {
                throw new Exception("ID da área não informado");
            }

            $pdo = Connection::open();
            $stmt = $pdo->prepare("UPDATE monitoring_point_area SET active = 1, updated_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            echo $this->returnSuccess("Área de monitoramento ativada com sucesso", ['id' => $id, 'active' => 1]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * PUT /monitoringArea/{id}/disable
     */
    public function actionDisable()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if (!$id) {
                throw new Exception("ID da área não informado");
            }

            $pdo = Connection::open();
            $stmt = $pdo->prepare("UPDATE monitoring_point_area SET active = 0, updated_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            echo $this->returnSuccess("Área de monitoramento desativada com sucesso", ['id' => $id, 'active' => 0]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * DELETE /monitoringArea/{id}
     */
    public function actionDelete()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if (!$id) {
                throw new Exception("ID da área não informado");
            }

            $pdo = Connection::open();
            $stmt = $pdo->prepare("DELETE FROM monitoring_point_area WHERE id = :id");
            $stmt->execute([':id' => $id]);

            echo $this->returnSuccess("Área de monitoramento excluída com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
