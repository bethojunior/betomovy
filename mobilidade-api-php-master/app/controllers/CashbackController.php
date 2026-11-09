<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class CashbackController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'POST') {
            return $this->handlePost();
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

            $sql = "SELECT * FROM cashback {$where} ORDER BY id DESC";
            $list = GenericDao::get($sql, $params);

            echo $this->returnSuccess("Cashback listado com sucesso", $list);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar cashback");
        }
    }

    private function handlePost()
    {
        try {
            $data = (array)$this->request();
            $cityId = $data['cityId'] ?? null;
            $tripTypeId = $data['tripTypeId'] ?? null;
            $value = $data['value'] ?? 0;
            $valueType = $data['valueType'] ?? '%';
            $addToFinalPrice = !empty($data['addToFinalPrice']) ? 1 : 0;
            $backToTripBalance = !empty($data['backToTripBalance']) ? 1 : 0;

            $sql = "INSERT INTO cashback (cityId, tripTypeId, value, valueType, addToFinalPrice, backToTripBalance, created_at)
                    VALUES (:cityId, :tripTypeId, :value, :valueType, :addToFinalPrice, :backToTripBalance, NOW())";
            
            $id = GenericDao::insert($sql, [
                ':cityId' => $cityId,
                ':tripTypeId' => $tripTypeId,
                ':value' => $value,
                ':valueType' => $valueType,
                ':addToFinalPrice' => $addToFinalPrice,
                ':backToTripBalance' => $backToTripBalance
            ]);

            echo $this->returnSuccess("Cashback inserido com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir cashback");
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
                GenericDao::execute("UPDATE cashback SET deleted_at = NOW() WHERE id = :id", [':id' => $id]);
            }

            echo $this->returnSuccess("Cashback deletado com sucesso", ['id' => $id]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao deletar cashback");
        }
    }
}
