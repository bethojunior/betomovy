<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class NeighborhoodRidesController extends ApiController
{
    /**
     * GET /NeighborhoodRides/central/{idCentral}
     */
    public function actionCentral()
    {
        try {
            $centralId = (int)($_GET['id'] ?? ($_GET['idCentral'] ?? 0));
            $pdo = Connection::open(Connection::DB_MYSQL_RO);

            $stmt = $pdo->prepare("
                SELECT 
                    nr.id,
                    nr.idCentral,
                    nr.cityId,
                    nr.originName,
                    nr.destinyName,
                    nr.originArea,
                    nr.destinyArea,
                    nr.price,
                    nr.tripTypeId,
                    nr.active,
                    COALESCE(c.name, '') as cityName,
                    COALESCE(tt.type, 'Padrão') as tripTypeName
                FROM neighborhoodRides nr
                LEFT JOIN city c ON nr.cityId = c.idCity
                LEFT JOIN tripType tt ON nr.tripTypeId = tt.idTripType
                WHERE nr.idCentral = :idCentral AND nr.deleted_at IS NULL
                ORDER BY nr.id DESC
            ");
            $stmt->execute([':idCentral' => $centralId]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $result = [];
            foreach ($rows as $row) {
                $originArea = $row['originArea'];
                if (is_string($originArea) && (strpos($originArea, '[') === 0 || strpos($originArea, '{') === 0)) {
                    $originArea = json_decode($originArea, true);
                }

                $destinyArea = $row['destinyArea'];
                if (is_string($destinyArea) && (strpos($destinyArea, '[') === 0 || strpos($destinyArea, '{') === 0)) {
                    $destinyArea = json_decode($destinyArea, true);
                }

                $result[] = [
                    'id' => (int)$row['id'],
                    'idCentral' => (int)$row['idCentral'],
                    'cityId' => (int)$row['cityId'],
                    'city' => $row['cityName'] ?: 'Central',
                    'originName' => $row['originName'],
                    'destinyName' => $row['destinyName'],
                    'origin' => $originArea,
                    'destiny' => $destinyArea,
                    'price' => (float)$row['price'],
                    'tripTypeId' => (int)$row['tripTypeId'],
                    'tripType' => $row['tripTypeName'],
                    'active' => (bool)$row['active'],
                ];
            }

            echo $this->returnSuccess("Bairros listados com sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * POST /NeighborhoodRides/insert
     */
    public function actionInsert()
    {
        try {
            $data = $this->request();
            $idCentral = (int)($data->idCentral ?? ($_GET['idCentral'] ?? 0));
            $cityId = (int)($data->cityId ?? 0);
            $originName = trim($data->origin->name ?? ($data->originName ?? ''));
            $destinyName = trim($data->destiny->name ?? ($data->destinyName ?? ''));
            $originArea = json_encode($data->origin->area ?? ($data->originArea ?? []));
            $destinyArea = json_encode($data->destiny->area ?? ($data->destinyArea ?? []));
            $price = (float)($data->price ?? 0);
            $tripTypeId = (int)($data->tripTypeId ?? 1);
            $active = isset($data->active) ? ($data->active ? 1 : 0) : 1;

            if (empty($originName) || empty($destinyName) || !$idCentral) {
                throw new Exception("Origem, destino e central são obrigatórios");
            }

            $pdo = Connection::open(Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("
                INSERT INTO neighborhoodRides 
                    (idCentral, cityId, originName, destinyName, originArea, destinyArea, price, tripTypeId, active, created_at, updated_at)
                VALUES 
                    (:idCentral, :cityId, :originName, :destinyName, :originArea, :destinyArea, :price, :tripTypeId, :active, NOW(), NOW())
            ");
            $stmt->execute([
                ':idCentral' => $idCentral,
                ':cityId' => $cityId ?: null,
                ':originName' => $originName,
                ':destinyName' => $destinyName,
                ':originArea' => $originArea,
                ':destinyArea' => $destinyArea,
                ':price' => $price,
                ':tripTypeId' => $tripTypeId ?: 1,
                ':active' => $active,
            ]);

            $id = $pdo->lastInsertId();
            echo $this->returnSuccess("Rota de bairro cadastrada com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * DELETE /NeighborhoodRides/{id}
     */
    public function actionDelete()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if (!$id) {
                throw new Exception("ID da rota não informado");
            }

            $pdo = Connection::open(Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("UPDATE neighborhoodRides SET deleted_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            echo $this->returnSuccess("Rota de bairro excluída com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * PUT /NeighborhoodRides/{id}
     */
    public function actionUpdate()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if (!$id) {
                throw new Exception("ID da rota não informado");
            }

            $data = $this->request();
            $pdo = Connection::open(Connection::DB_MYSQL_RW);

            $fields = [];
            $params = [':id' => $id];

            if (isset($data->active)) {
                $fields[] = "active = :active";
                $params[':active'] = $data->active ? 1 : 0;
            }
            if (isset($data->price)) {
                $fields[] = "price = :price";
                $params[':price'] = (float)$data->price;
            }
            if (isset($data->origin->name)) {
                $fields[] = "originName = :origName";
                $params[':origName'] = $data->origin->name;
            }
            if (isset($data->destiny->name)) {
                $fields[] = "destinyName = :destName";
                $params[':destName'] = $data->destiny->name;
            }
            if (isset($data->origin->area)) {
                $fields[] = "originArea = :origArea";
                $params[':origArea'] = json_encode($data->origin->area);
            }
            if (isset($data->destiny->area)) {
                $fields[] = "destinyArea = :destArea";
                $params[':destArea'] = json_encode($data->destiny->area);
            }

            if (!empty($fields)) {
                $fields[] = "updated_at = NOW()";
                $sql = "UPDATE neighborhoodRides SET " . implode(', ', $fields) . " WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }

            echo $this->returnSuccess("Rota de bairro atualizada com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * REST fallback for /NeighborhoodRides/{id}
     */
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'DELETE') {
            $this->actionDelete();
        } elseif ($method === 'PUT' || $method === 'PATCH') {
            $this->actionUpdate();
        } else {
            $this->actionCentral();
        }
    }
}
