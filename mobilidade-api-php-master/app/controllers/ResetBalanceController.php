<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class ResetBalanceController extends ApiController
{
    /**
     * POST /resetBalance/driver/{idDriver}
     */
    public function actionDriver()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RW);

            $rawInput = file_get_contents('php://input');
            $data = json_decode($rawInput, true);
            if (!is_array($data)) {
                $data = $_POST;
            }

            $driverId = isset($_GET['id']) && is_numeric($_GET['id'])
                ? (int)$_GET['id']
                : (int)($data['userId'] ?? $data['driverId'] ?? 0);

            if ($driverId <= 0) {
                throw new Exception("ID do motorista não informado");
            }

            // Localizar o motorista por idDriver primeiro, ou por userId como fallback
            $stmtDrv = $pdo->prepare("SELECT idDriver, userId, balanceId FROM driver WHERE idDriver = :id LIMIT 1");
            $stmtDrv->execute([':id' => $driverId]);
            $driver = $stmtDrv->fetch(PDO::FETCH_ASSOC);

            if (!$driver) {
                $stmtDrvUser = $pdo->prepare("SELECT idDriver, userId, balanceId FROM driver WHERE userId = :id LIMIT 1");
                $stmtDrvUser->execute([':id' => $driverId]);
                $driver = $stmtDrvUser->fetch(PDO::FETCH_ASSOC);
            }

            if (!$driver) {
                throw new Exception("Motorista não encontrado");
            }

            $balanceId = !empty($driver['balanceId']) ? (int)$driver['balanceId'] : 0;

            if ($balanceId <= 0) {
                // Se não tinha balanceId, cria já zerado
                $stmtNewB = $pdo->prepare("
                    INSERT INTO balance (balance, blockedBalance, blockedBalanceToPay, tripBalance, withheldBalance)
                    VALUES (0.00, 0.00, 0.00, 0.00, 0.00)
                ");
                $stmtNewB->execute();
                $balanceId = (int)$pdo->lastInsertId();

                $stmtUpDrv = $pdo->prepare("UPDATE driver SET balanceId = :balanceId WHERE idDriver = :idDriver");
                $stmtUpDrv->execute([':balanceId' => $balanceId, ':idDriver' => (int)$driver['idDriver']]);
            } else {
                // Zerar o saldo
                $stmtZero = $pdo->prepare("
                    UPDATE balance 
                    SET balance = 0.00, 
                        blockedBalance = 0.00,
                        blockedBalanceToPay = 0.00
                    WHERE idBalance = :id
                ");
                $stmtZero->execute([':id' => $balanceId]);
            }

            // Registrar no fluxo de saldo
            try {
                $stmtFlow = $pdo->prepare("
                    INSERT INTO balanceFlow (`date`, `value`, `balanceFlowTypeId`, `balanceId`, `observation`)
                    VALUES (NOW(), 0.00, 2, :balanceId, 'Saldo zerado pelo painel monitor')
                ");
                $stmtFlow->execute([':balanceId' => $balanceId]);
            } catch (\Throwable $tf) {
                // Registro de fluxo opcional
            }

            echo $this->returnSuccess("Saldo do motorista foi zerado", [
                'driverId' => (int)$driver['idDriver'],
                'balanceId' => $balanceId,
                'newBalance' => 0.00
            ]);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Não foi possível zerar o saldo");
        }
    }
}
