<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class SaleController extends ApiController
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
            $sql = "SELECT * FROM saleTrip WHERE deleted_at IS NULL ORDER BY id DESC";
            $list = GenericDao::get($sql);

            echo $this->returnSuccess("Promoções de viagens listadas com sucesso", $list);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar promoções");
        }
    }

    private function handlePost()
    {
        try {
            $data = (array)$this->request();
            $cityId = $data['cityId'] ?? null;
            $tripTypeId = $data['tripTypeId'] ?? null;
            $discount = $data['discount'] ?? 0;
            $startDay = $data['startDay'] ?? date('Y-m-d H:i:s');
            $endDay = $data['endDay'] ?? date('Y-m-d H:i:s', strtotime('+30 days'));
            $status = isset($data['status']) ? ($data['status'] ? 1 : 0) : 1;

            $sql = "INSERT INTO saleTrip (cityId, tripTypeId, discount, startDay, endDay, status, created_at)
                    VALUES (:cityId, :tripTypeId, :discount, :startDay, :endDay, :status, NOW())";
            
            $id = GenericDao::insert($sql, [
                ':cityId' => $cityId,
                ':tripTypeId' => $tripTypeId,
                ':discount' => $discount,
                ':startDay' => $startDay,
                ':endDay' => $endDay,
                ':status' => $status
            ]);

            echo $this->returnSuccess("Promoção criada com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao criar promoção");
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

            if (isset($data['discount'])) {
                $fields[] = "discount = :discount";
                $params[':discount'] = $data['discount'];
            }
            if (isset($data['startDay'])) {
                $fields[] = "startDay = :startDay";
                $params[':startDay'] = $data['startDay'];
            }
            if (isset($data['endDay'])) {
                $fields[] = "endDay = :endDay";
                $params[':endDay'] = $data['endDay'];
            }
            if (isset($data['status'])) {
                $fields[] = "status = :status";
                $params[':status'] = $data['status'] ? 1 : 0;
            }

            if (!empty($fields) && !empty($id)) {
                $fields[] = "updated_at = NOW()";
                $sql = "UPDATE saleTrip SET " . implode(', ', $fields) . " WHERE id = :id";
                GenericDao::execute($sql, $params);
            }

            echo $this->returnSuccess("Promoção atualizada com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao atualizar promoção");
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
                GenericDao::execute("UPDATE saleTrip SET deleted_at = NOW() WHERE id = :id", [':id' => $id]);
            }

            echo $this->returnSuccess("Promoção deletada com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao deletar promoção");
        }
    }
}
