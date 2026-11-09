<?php

namespace app\controllers;

use Exception;
use PDO;

class DriverAttachmentTypeController extends ApiController
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
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $rows = [];
            try {
                $rows = $pdo->query("SELECT * FROM driverAttachmentType WHERE deleted_at IS NULL ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
            } catch (\Throwable $e) {}

            echo $this->returnSuccess('Acessórios do motorista', $rows ?: []);
        } catch (\Throwable $e) {
            echo $this->returnSuccess('Acessórios do motorista', []);
        }
    }

    private function store()
    {
        try {
            $name = $_POST['name'] ?? '';
            $description = $_POST['description'] ?? '';
            $picture = '';

            if (isset($_FILES['picture']) && !empty($_FILES['picture']['tmp_name'])) {
                // upload picture if provided
                $picture = basename($_FILES['picture']['name']);
            }

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("
                INSERT INTO driverAttachmentType (name, description, picture, created_at, updated_at)
                VALUES (:name, :desc, :pic, NOW(), NOW())
            ");
            $stmt->execute([':name' => $name, ':desc' => $description, ':pic' => $picture]);
            $id = $pdo->lastInsertId();

            echo $this->returnSuccess('Acessório adicionado com sucesso', [
                'id' => (int)$id,
                'name' => $name,
                'description' => $description,
                'picture' => $picture
            ]);
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }

    private function update(int $id)
    {
        try {
            $body = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            $name = $body['name'] ?? '';
            $description = $body['description'] ?? '';

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("
                UPDATE driverAttachmentType 
                SET name = :name, description = :desc, updated_at = NOW()
                WHERE id = :id
            ");
            $stmt->execute([':name' => $name, ':desc' => $description, ':id' => $id]);

            echo $this->returnSuccess('Acessório atualizado com sucesso');
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }

    private function delete(int $id)
    {
        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("UPDATE driverAttachmentType SET deleted_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            echo $this->returnSuccess('Acessório excluído com sucesso');
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }
}
