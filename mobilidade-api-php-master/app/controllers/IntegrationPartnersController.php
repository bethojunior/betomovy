<?php

namespace app\controllers;

use app\dao\IntegrationPartnersDao;
use Exception;
use PDO;

class IntegrationPartnersController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

        if ($method === 'POST') {
            $this->store();
            return;
        }

        if ($method === 'PUT' && $id) {
            $this->update($id);
            return;
        }

        if ($method === 'DELETE' && $id) {
            $this->delete($id);
            return;
        }

        try {
            $dao = new IntegrationPartnersDao();
            $rows = $dao->findAllPartners();
            echo $this->returnSuccess('Credenciais encontradas com sucesso', $rows ?: []);
        } catch (\Throwable $e) {
            echo $this->returnSuccess('Credenciais', []);
        }
    }

    private function store()
    {
        try {
            $body = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("
                INSERT INTO integration_partners (name, url, action, token, created_at, updated_at)
                VALUES (:name, :url, :action, :token, NOW(), NOW())
            ");
            $stmt->execute([
                ':name' => $body['name'] ?? '',
                ':url' => $body['url'] ?? '',
                ':action' => $body['action'] ?? '',
                ':token' => $body['token'] ?? ''
            ]);
            $id = $pdo->lastInsertId();
            echo $this->returnSuccess('Credencial criada com sucesso', [
                'id' => (string)$id,
                'name' => $body['name'] ?? '',
                'url' => $body['url'] ?? '',
                'action' => $body['action'] ?? '',
                'token' => $body['token'] ?? ''
            ]);
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }

    private function update(int $id)
    {
        try {
            $body = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("
                UPDATE integration_partners 
                SET name = :name, url = :url, action = :action, token = :token, updated_at = NOW()
                WHERE id = :id
            ");
            $stmt->execute([
                ':name' => $body['name'] ?? '',
                ':url' => $body['url'] ?? '',
                ':action' => $body['action'] ?? '',
                ':token' => $body['token'] ?? '',
                ':id' => $id
            ]);
            echo $this->returnSuccess('Credencial atualizada com sucesso');
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }

    private function delete(int $id)
    {
        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("UPDATE integration_partners SET deleted_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo $this->returnSuccess('Credencial excluída com sucesso');
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }
}
