<?php

namespace app\controllers;

use app\dao\EstablishmentDao;
use app\utils\Connection;
use Exception;
use PDO;

class NeighborhoodController extends ApiController
{
    /**
     * GET /neighborhood?lat=...&lng=... or ?cityId=...
     */
    public function actionIndex()
    {
        try {
            $pdo = Connection::open();
            $cityId = $_GET['cityId'] ?? $_GET['city'] ?? null;
            $lat = $_GET['lat'] ?? null;
            $lng = $_GET['lng'] ?? null;

            if (!$cityId && $lat && $lng) {
                // Find city closest to lat/lng
                $stmtCity = $pdo->prepare("
                    SELECT id FROM city
                    ORDER BY ((latitude - :lat)*(latitude - :lat) + (longitude - :lng)*(longitude - :lng)) ASC
                    LIMIT 1
                ");
                $stmtCity->execute([':lat' => (float)$lat, ':lng' => (float)$lng]);
                $cityId = $stmtCity->fetchColumn();
            }

            $where = ["deleted_at IS NULL"];
            $params = [];

            if ($cityId) {
                $where[] = "cityId = :cityId";
                $params[':cityId'] = (int)$cityId;
            }

            $whereSql = implode(' AND ', $where);
            $stmt = $pdo->prepare("SELECT id, name, cityId FROM neighborhood WHERE {$whereSql} ORDER BY name ASC");
            $stmt->execute($params);
            $neighborhoods = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fallback: If no neighborhoods registered for this city yet, return all or default list
            if (empty($neighborhoods)) {
                $stmtAll = $pdo->query("SELECT id, name, cityId FROM neighborhood WHERE deleted_at IS NULL ORDER BY name ASC LIMIT 30");
                $neighborhoods = $stmtAll ? $stmtAll->fetchAll(PDO::FETCH_ASSOC) : [];
            }

            echo $this->returnSuccess("Lista de bairros", $neighborhoods);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionStore()
    {
        try {
            $data = $this->request();
            $name = $data->name ?? null;
            $cityId = $data->cityId ?? null;

            if (!$name || !$cityId) {
                throw new Exception("Nome e cidade são obrigatórios");
            }

            $pdo = Connection::open();
            $stmt = $pdo->prepare("INSERT INTO neighborhood (name, cityId, created_at, updated_at) VALUES (:name, :cityId, NOW(), NOW())");
            $stmt->execute([':name' => $name, ':cityId' => $cityId]);
            $id = $pdo->lastInsertId();

            echo $this->returnSuccess("Bairro cadastrado com sucesso", ['id' => $id, 'name' => $name, 'cityId' => $cityId]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDelete()
    {
        try {
            $id = $_GET['id'] ?? null;
            if (!$id) {
                throw new Exception("ID do bairro não informado");
            }

            $pdo = Connection::open();
            $stmt = $pdo->prepare("UPDATE neighborhood SET deleted_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            echo $this->returnSuccess("Bairro excluído com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetAll()
    {
        $cityId = $_GET['city'] ?? null;
        try {
            $establishmentDao = new EstablishmentDao;
            echo $this->returnSuccess("Listando bairros onde possui estabelecimentos",
                [
                    "neighborhoods" => $establishmentDao->getNeighborhoods($cityId),
                    "price" => $establishmentDao->getMinAndMaxPriceByCity($cityId)
                ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}