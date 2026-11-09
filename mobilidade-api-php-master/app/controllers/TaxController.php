<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class TaxController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'POST') {
            return $this->handlePost();
        } elseif ($method === 'PUT') {
            return $this->handlePut();
        } elseif ($method === 'DELETE') {
            return $this->handleDelete();
        }
        return $this->handleGet();
    }

    private function handleGet()
    {
        try {
            $cityId = $_GET['cityId'] ?? null;
            $tripTypeId = $_GET['tripTypeId'] ?? null;

            $params = [];
            $where = "WHERE deleted_at IS NULL";

            if (!empty($cityId)) {
                $where .= " AND cityId = :cityId";
                $params[':cityId'] = $cityId;
            }
            if (!empty($tripTypeId)) {
                $where .= " AND tripTypeId = :tripTypeId";
                $params[':tripTypeId'] = $tripTypeId;
            }

            $sql = "SELECT * FROM tax {$where} ORDER BY id DESC";
            $list = GenericDao::get($sql, $params);

            echo $this->returnSuccess("Taxas listadas com sucesso", $list);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar taxas");
        }
    }

    private function handlePost()
    {
        try {
            $data = (array)$this->request();
            $name = $data['name'] ?? 'Taxa';
            $cityId = $data['cityId'] ?? null;
            $tripTypeId = $data['tripTypeId'] ?? null;
            $value = $data['value'] ?? 0;
            $valueType = $data['valueType'] ?? '%';
            $chargeBy = $data['chargeBy'] ?? 'customer';
            $active = isset($data['active']) ? ($data['active'] ? 1 : 0) : 1;

            $sql = "INSERT INTO tax (name, cityId, tripTypeId, value, valueType, chargeBy, active, created_at)
                    VALUES (:name, :cityId, :tripTypeId, :value, :valueType, :chargeBy, :active, NOW())";
            
            $id = GenericDao::insert($sql, [
                ':name' => $name,
                ':cityId' => $cityId,
                ':tripTypeId' => $tripTypeId,
                ':value' => $value,
                ':valueType' => $valueType,
                ':chargeBy' => $chargeBy,
                ':active' => $active
            ]);

            echo $this->returnSuccess("Taxa adicionada com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao adicionar taxa");
        }
    }

    private function handlePut()
    {
        try {
            $id = $_GET['id'] ?? null;
            if (!$id) {
                $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
                $parts = explode('/', trim($uri, '/'));
                $id = end($parts);
            }

            $data = (array)$this->request();
            $fields = [];
            $params = [':id' => $id];

            if (isset($data['name'])) {
                $fields[] = "name = :name";
                $params[':name'] = $data['name'];
            }
            if (isset($data['value'])) {
                $fields[] = "value = :value";
                $params[':value'] = $data['value'];
            }
            if (isset($data['valueType'])) {
                $fields[] = "valueType = :valueType";
                $params[':valueType'] = $data['valueType'];
            }
            if (isset($data['active'])) {
                $fields[] = "active = :active";
                $params[':active'] = $data['active'] ? 1 : 0;
            }

            if (!empty($fields) && !empty($id)) {
                $fields[] = "updated_at = NOW()";
                $sql = "UPDATE tax SET " . implode(', ', $fields) . " WHERE id = :id";
                GenericDao::execute($sql, $params);
            }

            echo $this->returnSuccess("Taxa atualizada com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao atualizar taxa");
        }
    }

    private function handleDelete()
    {
        try {
            $id = $_GET['id'] ?? null;
            if (!$id) {
                $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
                $parts = explode('/', trim($uri, '/'));
                $id = end($parts);
            }

            if (!empty($id) && is_numeric($id)) {
                GenericDao::execute("UPDATE tax SET deleted_at = NOW() WHERE id = :id", [':id' => $id]);
            }

            echo $this->returnSuccess("Taxa deletada com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao deletar taxa");
        }
    }
}
