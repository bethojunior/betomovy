<?php

namespace app\controllers;

use Exception;

class DriverCommissionController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'POST') {
            $this->actionStore();
            return;
        }

        try {
            $cityId = (int)($_GET['id'] ?? ($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0)));
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            try {
                $pdo->exec("
                    CREATE TABLE IF NOT EXISTS driverCommission (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        cityId INT NOT NULL,
                        tripTypeId INT NOT NULL,
                        statusId INT NOT NULL DEFAULT 1,
                        created_at DATETIME NULL
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                    CREATE TABLE IF NOT EXISTS driverCommissionPaymentForm (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        driverCommissionId INT NOT NULL,
                        tripPaymentFormId INT NOT NULL,
                        value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                        valueType VARCHAR(10) NOT NULL DEFAULT '%',
                        created_at DATETIME NULL
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                ");
            } catch (\Throwable $t) {}

            $stmt = $pdo->prepare("
                SELECT id, cityId, tripTypeId
                FROM driverCommission
                WHERE (cityId = :cityId OR :cityIdZero = 0)
                  AND statusId = 1
            ");
            $stmt->execute([':cityId' => $cityId, ':cityIdZero' => $cityId]);
            $commissions = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            foreach ($commissions as &$c) {
                $stmtForms = $pdo->prepare("
                    SELECT tripPaymentFormId, value, valueType
                    FROM driverCommissionPaymentForm
                    WHERE driverCommissionId = :id
                ");
                $stmtForms->execute([':id' => $c['id']]);
                $c['commissions_payment_form'] = $stmtForms->fetchAll(\PDO::FETCH_ASSOC);
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Comissões encontradas',
                'data' => $commissions,
                'response' => $commissions,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Nenhuma comissão',
                'data' => [],
                'response' => [],
                'errors' => null
            ]);
        }
    }

    public function actionStore()
    {
        try {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Comissão salva',
                'data' => true,
                'response' => true,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao salvar comissão',
                'data' => null,
                'response' => null,
                'errors' => null
            ]);
        }
    }
}
