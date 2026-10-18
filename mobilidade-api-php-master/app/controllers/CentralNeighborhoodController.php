<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class CentralNeighborhoodController extends ApiController
{
    /**
     * GET /centralNeighborhood or /centralNeighborhood/{id}
     */
    public function actionIndex()
    {
        try {
            $centralId = $_GET['id'] ?? $_GET['centralId'] ?? null;
            $pdo = Connection::open();

            $where = ["cn.deleted_at IS NULL"];
            $params = [];

            if ($centralId) {
                $where[] = "cn.centralId = :centralId";
                $params[':centralId'] = (int)$centralId;
            }

            $whereSql = implode(' AND ', $where);
            $sql = "
                SELECT
                    cn.id,
                    cn.value,
                    cn.neighborhoodId,
                    coalesce(n.name, 'Bairro') as neighborhoodName,
                    coalesce(n.name, 'Bairro') as neighborhood,
                    cn.tripTypeId,
                    coalesce(tt.type, 'Padrão') as tripTypeName,
                    cn.centralId
                FROM centralNeighborhood cn
                LEFT JOIN neighborhood n ON cn.neighborhoodId = n.id
                LEFT JOIN tripType tt ON cn.tripTypeId = tt.idTripType
                WHERE {$whereSql}
                ORDER BY cn.id DESC
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $fees = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo $this->returnSuccess("Taxas por bairro listadas", $fees);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * POST /centralNeighborhood
     */
    public function actionInsert()
    {
        $this->actionStore();
    }

    public function actionStore()
    {
        try {
            $data = $this->request();
            $value = $data->value ?? $data->amount ?? 0;
            $neighborhoodId = $data->neighborhoodId ?? $data->neighborhood ?? null;
            $tripTypeId = $data->tripTypeId ?? $data->typeOfCall ?? null;
            $centralId = $data->centralId ?? null;

            if (!$neighborhoodId || !$centralId) {
                throw new Exception("Bairro e Central são obrigatórios");
            }

            $pdo = Connection::open();
            $stmt = $pdo->prepare("
                INSERT INTO centralNeighborhood (value, neighborhoodId, tripTypeId, centralId, created_at, updated_at)
                VALUES (:value, :neighborhoodId, :tripTypeId, :centralId, NOW(), NOW())
            ");
            $stmt->execute([
                ':value' => (float)$value,
                ':neighborhoodId' => (int)$neighborhoodId,
                ':tripTypeId' => $tripTypeId ? (int)$tripTypeId : 1,
                ':centralId' => (int)$centralId
            ]);

            $id = $pdo->lastInsertId();
            echo $this->returnSuccess("Taxa por bairro cadastrada com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * DELETE /centralNeighborhood/{id}
     */
    public function actionDelete()
    {
        try {
            $id = $_GET['id'] ?? null;
            if (!$id) {
                throw new Exception("ID não informado");
            }

            $pdo = Connection::open();
            $stmt = $pdo->prepare("UPDATE centralNeighborhood SET deleted_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            echo $this->returnSuccess("Taxa por bairro excluída com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
