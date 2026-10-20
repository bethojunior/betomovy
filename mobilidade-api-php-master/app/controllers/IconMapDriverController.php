<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class IconMapDriverController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

        if (strtoupper($method) === 'POST') {
            $this->handleCreate();
            return;
        }

        if (strtoupper($method) === 'DELETE') {
            $this->handleDelete();
            return;
        }

        $this->handleList();
    }

    private function handleList()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $stmt = $pdo->query("SELECT id, link, statusId FROM iconMapDriver WHERE statusId = 1 ORDER BY id ASC");
            $icons = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($icons as &$ic) {
                $ic['id'] = (int)$ic['id'];
                $ic['statusId'] = (int)$ic['statusId'];
            }
            unset($ic);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Ícones encontrados',
                'response' => $icons,
                'data' => $icons,
                'errors' => null
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao buscar ícones: ' . $e->getMessage(),
                'response' => [],
                'data' => [],
                'errors' => ['message' => $e->getMessage()]
            ]);
        }
    }

    private function handleCreate()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);

            $link = '';
            if (isset($_FILES['icon']) && $_FILES['icon']['error'] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['icon']['name'], PATHINFO_EXTENSION) ?: 'png';
                $filename = 'icon_' . time() . '_' . uniqid() . '.' . $ext;
                $uploadDir = __DIR__ . '/../../public/uploads/iconMapDriver/';
                if (!is_dir($uploadDir)) {
                    @mkdir($uploadDir, 0777, true);
                }
                move_uploaded_file($_FILES['icon']['tmp_name'], $uploadDir . $filename);
                $link = 'https://api.movymob.com/uploads/iconMapDriver/' . $filename;
            } elseif (!empty($_POST['link'])) {
                $link = trim($_POST['link']);
            } else {
                throw new Exception("Arquivo de ícone não enviado");
            }

            $stmt = $pdo->prepare("INSERT INTO iconMapDriver (link, statusId) VALUES (:link, 1)");
            $stmt->execute([':link' => $link]);
            $newId = (int)$pdo->lastInsertId();

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Ícone adicionado com sucesso!',
                'response' => [
                    'id' => $newId,
                    'link' => $link,
                    'statusId' => 1
                ],
                'data' => [
                    'id' => $newId,
                    'link' => $link,
                    'statusId' => 1
                ],
                'errors' => null
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Não foi possível adicionar o novo ícone: ' . $e->getMessage(),
                'response' => null,
                'data' => null,
                'errors' => ['message' => $e->getMessage()]
            ]);
        }
    }

    private function handleDelete()
    {
        try {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id <= 0) {
                $path = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
                $last = end($path);
                if (is_numeric($last)) {
                    $id = (int)$last;
                }
            }

            if ($id <= 0) {
                throw new Exception("ID do ícone não informado");
            }

            $pdo = Connection::open(Connection::DB_MYSQL);

            // Check if icon is linked to any active userType
            $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM userType WHERE iconMapDriverId = :id AND (statusId = 1 OR statusId IS NULL)");
            $stmtCheck->execute([':id' => $id]);
            $count = (int)$stmtCheck->fetchColumn();

            if ($count > 0) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'O ícone está vinculado a, pelo menos, um tipo de motorista',
                    'response' => false,
                    'data' => false
                ]);
                return;
            }

            $stmt = $pdo->prepare("UPDATE iconMapDriver SET statusId = 2 WHERE id = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Ícone removido com sucesso!',
                'response' => true,
                'data' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao remover ícone: ' . $e->getMessage(),
                'response' => false,
                'data' => false
            ]);
        }
    }
}
