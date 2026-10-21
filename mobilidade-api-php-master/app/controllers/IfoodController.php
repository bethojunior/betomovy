<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class IfoodController extends ApiController
{
    /**
     * GET /ifood/keys/{centralId}
     * PUT /ifood/keys/{centralId}
     */
    public function actionKeys()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
            if ($method === 'POST' && isset($_POST['_method'])) {
                $method = strtoupper($_POST['_method']);
            }

            $centralId = (int)($_GET['id'] ?? ($_GET['centralId'] ?? 0));
            $pdo = Connection::open(Connection::DB_MYSQL);

            // Ensure table exists
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS `ifood_keys` (
                    `id` INT AUTO_INCREMENT PRIMARY KEY,
                    `centralId` INT NOT NULL,
                    `clientId` VARCHAR(255) NULL,
                    `clientSecret` TEXT NULL,
                    `token` TEXT NULL,
                    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX `idx_central_id` (`centralId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");

            if ($method === 'PUT' || $method === 'POST') {
                $raw = file_get_contents('php://input');
                $data = json_decode($raw, true) ?: $_POST;

                $clientId = trim($data['clientId'] ?? '');
                $clientSecret = trim($data['clientSecret'] ?? '');
                if (!$centralId && !empty($data['centralId'])) {
                    $centralId = (int)$data['centralId'];
                }

                $stmt = $pdo->prepare("SELECT id FROM ifood_keys WHERE centralId = :cid LIMIT 1");
                $stmt->execute([':cid' => $centralId]);
                $existing = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($existing) {
                    $upd = $pdo->prepare("UPDATE ifood_keys SET clientId = :clientId, clientSecret = :clientSecret, updated_at = NOW() WHERE id = :id");
                    $upd->execute([
                        ':clientId' => $clientId,
                        ':clientSecret' => $clientSecret,
                        ':id' => $existing['id']
                    ]);
                } else {
                    $ins = $pdo->prepare("INSERT INTO ifood_keys (centralId, clientId, clientSecret, created_at, updated_at) VALUES (:cid, :clientId, :clientSecret, NOW(), NOW())");
                    $ins->execute([
                        ':cid' => $centralId,
                        ':clientId' => $clientId,
                        ':clientSecret' => $clientSecret
                    ]);
                }

                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => true,
                    'message' => 'Chaves salvas com sucesso',
                    'response' => [
                        'centralId' => $centralId,
                        'clientId' => $clientId,
                        'clientSecret' => $clientSecret
                    ],
                    'data' => [
                        'centralId' => $centralId,
                        'clientId' => $clientId,
                        'clientSecret' => $clientSecret
                    ],
                    'errors' => null
                ]);
                return;
            }

            // GET
            $stmt = $pdo->prepare("SELECT clientId, clientSecret FROM ifood_keys WHERE centralId = :cid LIMIT 1");
            $stmt->execute([':cid' => $centralId]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $result = [
                'centralId' => $centralId,
                'clientId' => $row['clientId'] ?? '',
                'clientSecret' => $row['clientSecret'] ?? ''
            ];

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Chaves recuperadas com sucesso',
                'response' => $result,
                'data' => $result,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao processar chaves: ' . $e->getMessage(),
                'response' => null,
                'data' => null,
                'errors' => ['message' => $e->getMessage()]
            ]);
        }
    }
}
