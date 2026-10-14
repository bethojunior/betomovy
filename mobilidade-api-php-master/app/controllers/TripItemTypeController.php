<?php

namespace app\controllers;

use app\services\TripItemTypeService;
use app\utils\Connection;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 16:59
 */
class TripItemTypeController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if (strtoupper($method) === 'POST') {
            return $this->handleInsert();
        }
        if (strtoupper($method) === 'DELETE') {
            return $this->handleDelete();
        }
        return $this->actionAll();
    }

    public function actionAll()
    {
        try {
            echo $this->returnSuccess("Tipos de itens encontrados com sucesso",
                (new TripItemTypeService)
                    ->getAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os tipos de itens");
        }
    }

    private function handleInsert()
    {
        try {
            $data = $this->getPostValues();
            if (empty($data)) {
                $raw = file_get_contents('php://input');
                $data = json_decode($raw, true) ?: [];
            }
            $name = $data['name'] ?? '';
            $picture = $data['picture'] ?? null;
            $pdo = Connection::open();
            $stmt = $pdo->prepare("INSERT INTO tripItemType (name, picture, statusId) VALUES (:name, :picture, 1)");
            $stmt->execute([':name' => $name, ':picture' => $picture]);
            echo $this->returnSuccess("Tipo de item inserido com sucesso", ['id' => $pdo->lastInsertId()]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir tipo de item");
        }
    }

    private function handleDelete()
    {
        try {
            $id = $_GET['id'] ?? null;
            if (!$id) {
                throw new Exception("ID não fornecido");
            }
            $pdo = Connection::open();
            $stmt = $pdo->prepare("UPDATE tripItemType SET statusId = 2 WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo $this->returnSuccess("Tipo de item excluído com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao excluir tipo de item");
        }
    }
}