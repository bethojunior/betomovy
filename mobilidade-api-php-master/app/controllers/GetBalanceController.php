<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class GetBalanceController extends ApiController
{
    public function actionIndex()
    {
        $this->handleGetBalance();
    }

    public function actionFind()
    {
        $this->handleGetBalance();
    }

    private function handleGetBalance()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
            $parts = explode('/', trim($uri, '/'));
            $id = end($parts);

            if (!is_numeric($id) && isset($_GET['id'])) {
                $id = $_GET['id'];
            }

            if (is_numeric($id)) {
                $stmt = $pdo->prepare("SELECT * FROM balance WHERE idBalance = :id LIMIT 1");
                $stmt->execute([':id' => (int)$id]);
                $bal = $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                $bal = null;
            }

            if (!$bal) {
                $bal = [
                    'idBalance' => (int)($id ?: 1),
                    'balance' => 0.00,
                    'blockedBalance' => 0.00,
                    'blockedBalanceToPay' => 0.00,
                    'tripBalance' => 0.00,
                    'withheldBalance' => 0.00
                ];
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Saldo encontrado',
                'response' => (object)$bal,
                'data' => (object)$bal,
                'errors' => null
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => ['message' => $e->getMessage()]
            ]);
        }
    }
}
