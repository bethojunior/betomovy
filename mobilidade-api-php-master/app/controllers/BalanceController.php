<?php

namespace app\controllers;
use app\dao\DriverBalanceFlowViewDao;
use app\services\FlowTypeService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/09/2018
 * Time: 16:50
 */
class BalanceController extends ApiController
{
    public function actionLastDriverTransactions()
    {
        try {
            $req = $this->request();
            $driverId = null;
            if (is_object($req) && isset($req->driverId)) {
                $driverId = $req->driverId;
            } elseif (is_array($req) && isset($req[0]->driverId)) {
                $driverId = $req[0]->driverId;
            }
            if (!$driverId && isset($_POST['driverId'])) {
                $driverId = $_POST['driverId'];
            }
            if (!$driverId && isset($_GET['driverId'])) {
                $driverId = $_GET['driverId'];
            }
            
            echo $this->returnSuccess("Últimas movimentações do motorista",
                (new DriverBalanceFlowViewDao)
                    ->lastDriverTransactions((int)$driverId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * Buscando o extrato financeiro de um motorista
     * com filtro de datas, filtro de tipo e paginação
     */
    public function actionDriverTransactions()
    {
        try {
            echo $this->returnSuccess("Movimentações do motorista filtradas",
                (new DriverBalanceFlowViewDao)
                    ->driverTransactionsFiltered($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetTypes()
    {
        try {
            echo $this->returnSuccess("Tipos de fluxos financeiros encontrados",
                (new FlowTypeService())
                    ->findAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os tipos de fluxos financeiros");
        }
    }

    /**
     * GET /balance/overview
     */
    public function actionOverview()
    {
        try {
            $pdo = \app\utils\Connection::open();
            $headers = function_exists('getallheaders') ? getallheaders() : [];
            $cityId = $headers['cityid'] ?? $headers['cityId'] ?? $_SERVER['HTTP_CITYID'] ?? $_GET['cityId'] ?? null;
            $cityWhere = $cityId ? "AND cityId = " . (int)$cityId : "";

            // Total revenue from finished trips
            $stmtRev = $pdo->query("SELECT coalesce(sum(price), 0) FROM trip WHERE status = 'finished' {$cityWhere}");
            $totalRevenue = (float)($stmtRev ? $stmtRev->fetchColumn() : 0);

            // Cancelled trips total value
            $stmtCanc = $pdo->query("SELECT coalesce(sum(price), 0) FROM trip WHERE status = 'canceled' {$cityWhere}");
            $cancelledTotal = (float)($stmtCanc ? $stmtCanc->fetchColumn() : 0);

            // Total wallet balance of active drivers
            $stmtWallet = $pdo->query("SELECT coalesce(sum(balance), 0) FROM balance");
            $walletBalance = (float)($stmtWallet ? $stmtWallet->fetchColumn() : 0);

            $data = [
                'total_revenue' => [
                    'current' => $totalRevenue,
                    'previous' => 0,
                    'difference' => $totalRevenue,
                    'percentage' => 0,
                    'trend' => 'up'
                ],
                'cancelled_total' => [
                    'current' => $cancelledTotal,
                    'previous' => 0,
                    'difference' => $cancelledTotal,
                    'percentage' => 0,
                    'trend' => 'down'
                ],
                'refunded_total' => [
                    'current' => 0,
                    'previous' => 0,
                    'difference' => 0,
                    'percentage' => 0,
                    'trend' => 'up'
                ],
                'wallet_balance' => [
                    'current' => $walletBalance
                ]
            ];

            echo $this->returnSuccess('Visão geral financeira', $data);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * PUT /balance/{idCustomer}/flow
     * Inserir ou retirar voucher de cliente
     */
    public function actionFlow()
    {
        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $rawInput = file_get_contents('php://input');
            $payload = json_decode($rawInput, true);
            if (!is_array($payload)) {
                $payload = $_POST;
            }

            $idCustomer = (int)($_GET['id'] ?? ($payload['idCustomer'] ?? ($payload['id'] ?? 0)));
            $action = strtolower(trim((string)($payload['action'] ?? 'insert')));
            $target = strtolower(trim((string)($payload['target'] ?? ($payload['type'] ?? 'voucher')))); // 'voucher' ou 'balance' / 'saldo'
            $amount = (float)str_replace(',', '.', (string)($payload['balance'] ?? ($payload['value'] ?? 0)));

            if ($idCustomer <= 0) {
                throw new Exception("Cliente não informado");
            }
            if ($amount <= 0) {
                throw new Exception("O valor deve ser maior que zero");
            }

            // Busca o cliente primeiro por idCustomer
            $stmtCust = $pdo->prepare("SELECT idCustomer, userId, balanceId FROM customer WHERE idCustomer = :id LIMIT 1");
            $stmtCust->execute([':id' => $idCustomer]);
            $customer = $stmtCust->fetch(\PDO::FETCH_ASSOC);

            if (!$customer) {
                // Tenta buscar por userId caso idCustomer não seja encontrado
                $stmtCust2 = $pdo->prepare("SELECT idCustomer, userId, balanceId FROM customer WHERE userId = :id LIMIT 1");
                $stmtCust2->execute([':id' => $idCustomer]);
                $customer = $stmtCust2->fetch(\PDO::FETCH_ASSOC);
            }

            if (!$customer) {
                // Se não for cliente, verifica se foi passado ID de motorista
                $stmtDrv = $pdo->prepare("SELECT idDriver, userId, balanceId FROM driver WHERE idDriver = :id OR userId = :id LIMIT 1");
                $stmtDrv->execute([':id' => $idCustomer]);
                $driver = $stmtDrv->fetch(\PDO::FETCH_ASSOC);
                if ($driver) {
                    $customer = [
                        'idCustomer' => $driver['idDriver'],
                        'userId' => $driver['userId'],
                        'balanceId' => $driver['balanceId']
                    ];
                }
            }

            if (!$customer) {
                throw new Exception("Cliente não encontrado");
            }

            $balanceId = !empty($customer['balanceId']) ? (int)$customer['balanceId'] : 0;

            // Se ainda não tiver balanceId ou balance não existir, cria o registro de saldo
            if ($balanceId <= 0) {
                $stmtNewB = $pdo->prepare("
                    INSERT INTO balance (balance, blockedBalance, blockedBalanceToPay, tripBalance, withheldBalance)
                    VALUES (0.00, 0.00, 0.00, 0.00, 0.00)
                ");
                $stmtNewB->execute();
                $balanceId = (int)$pdo->lastInsertId();

                $stmtUpCust = $pdo->prepare("UPDATE customer SET balanceId = :balanceId WHERE idCustomer = :idCustomer");
                $stmtUpCust->execute([':balanceId' => $balanceId, ':idCustomer' => (int)$customer['idCustomer']]);
            }

            // Busca o registro na tabela balance
            $stmtBal = $pdo->prepare("SELECT idBalance, tripBalance, balance FROM balance WHERE idBalance = :id LIMIT 1 FOR UPDATE");
            $stmtBal->execute([':id' => $balanceId]);
            $bal = $stmtBal->fetch(\PDO::FETCH_ASSOC);

            if (!$bal) {
                $stmtNewB = $pdo->prepare("
                    INSERT INTO balance (balance, blockedBalance, blockedBalanceToPay, tripBalance, withheldBalance)
                    VALUES (0.00, 0.00, 0.00, 0.00, 0.00)
                ");
                $stmtNewB->execute();
                $balanceId = (int)$pdo->lastInsertId();

                $stmtUpCust = $pdo->prepare("UPDATE customer SET balanceId = :balanceId WHERE idCustomer = :idCustomer");
                $stmtUpCust->execute([':balanceId' => $balanceId, ':idCustomer' => (int)$customer['idCustomer']]);

                $stmtBal = $pdo->prepare("SELECT idBalance, tripBalance, balance FROM balance WHERE idBalance = :id LIMIT 1 FOR UPDATE");
                $stmtBal->execute([':id' => $balanceId]);
                $bal = $stmtBal->fetch(\PDO::FETCH_ASSOC);
            }

            $currentTripBalance = (float)($bal['tripBalance'] ?? 0);
            $currentWalletBalance = (float)($bal['balance'] ?? 0);

            // Verifica tipo de ação: 'insert' (inserir) ou 'block'/'remove' (retirar)
            $isInsert = in_array($action, ['insert', 'add', 'deposit'], true);
            $isRemove = in_array($action, ['block', 'remove', 'withdraw', 'sub'], true);

            if (!$isInsert && !$isRemove) {
                throw new Exception("Ação inválida. Use 'insert' para inserir ou 'block'/'remove' para retirar.");
            }

            $isWalletBalance = in_array($target, ['balance', 'saldo', 'wallet'], true);

            if ($isWalletBalance) {
                // Movimenta saldo da carteira (coluna balance)
                if ($isInsert) {
                    $newWalletBalance = round($currentWalletBalance + $amount, 2);
                    $flowType = 34; // BALANCE_BONUS
                } else {
                    $newWalletBalance = round(max(0, $currentWalletBalance - $amount), 2);
                    $flowType = 71; // BALANCE_OUT_MANUAL
                }

                $stmtUpd = $pdo->prepare("UPDATE balance SET balance = :balance WHERE idBalance = :idBalance");
                $stmtUpd->execute([
                    ':balance' => $newWalletBalance,
                    ':idBalance' => $balanceId
                ]);
                $bal['balance'] = $newWalletBalance;
                $successMessage = "Saldo atualizado com sucesso";
            } else {
                // Movimenta voucher de corrida (coluna tripBalance)
                if ($isInsert) {
                    $newTripBalance = round($currentTripBalance + $amount, 2);
                    $flowType = \app\constant\CustomerBalanceConst::VOUCHER_BONUS;
                } else {
                    $newTripBalance = round(max(0, $currentTripBalance - $amount), 2);
                    $flowType = \app\constant\CustomerBalanceConst::BALANCE_OUT;
                }

                $stmtUpd = $pdo->prepare("UPDATE balance SET tripBalance = :tripBalance WHERE idBalance = :idBalance");
                $stmtUpd->execute([
                    ':tripBalance' => $newTripBalance,
                    ':idBalance' => $balanceId
                ]);
                $bal['tripBalance'] = $newTripBalance;
                $successMessage = "Voucher atualizado com sucesso";
            }

            // Registra movimentação no balanceFlow
            try {
                $stmtCheckType = $pdo->prepare("SELECT idBalanceFlowType FROM balanceFlowType WHERE idBalanceFlowType = :type LIMIT 1");
                $stmtCheckType->execute([':type' => $flowType]);
                if (!$stmtCheckType->fetch()) {
                    $stmtFirstType = $pdo->query("SELECT idBalanceFlowType FROM balanceFlowType ORDER BY idBalanceFlowType ASC LIMIT 1");
                    $flowType = $stmtFirstType ? (int)$stmtFirstType->fetchColumn() : 1;
                }

                $stmtFlow = $pdo->prepare("
                    INSERT INTO balanceFlow (`date`, `value`, `balanceFlowTypeId`, `balanceId`)
                    VALUES (NOW(), :val, :type, :balanceId)
                ");
                $stmtFlow->execute([
                    ':val' => $amount,
                    ':type' => $flowType,
                    ':balanceId' => $balanceId
                ]);
            } catch (\Throwable $tf) {
                // Registro de fluxo opcional não interrompe o sucesso da atualização do saldo
            }

            echo $this->returnSuccess($successMessage, $bal);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao atualizar voucher");
        }
    }

    /**
     * PUT/POST /balance/driver/{driverId}
     * Altera saldo da carteira do motorista (inserção ou retirada de saldo)
     */
    public function actionDriver()
    {
        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $rawInput = file_get_contents('php://input');
            $payload = json_decode($rawInput, true);
            if (!is_array($payload)) {
                $payload = $_POST;
            }

            $driverId = (int)($_GET['id'] ?? ($payload['driverId'] ?? 0));
            $value = (float)($payload['value'] ?? ($payload['amount'] ?? 0));
            $observation = trim((string)($payload['observation'] ?? 'Movimentação manual pelo monitor'));

            if ($driverId <= 0) {
                throw new Exception("Motorista não informado");
            }
            if ($value == 0) {
                throw new Exception("O valor deve ser diferente de zero");
            }

            // 1. Localizar o motorista por idDriver primeiro, e somente como fallback por userId
            $stmtDrv = $pdo->prepare("SELECT idDriver, userId, balanceId FROM driver WHERE idDriver = :id LIMIT 1");
            $stmtDrv->execute([':id' => $driverId]);
            $driver = $stmtDrv->fetch(\PDO::FETCH_ASSOC);

            if (!$driver) {
                $stmtDrvUser = $pdo->prepare("SELECT idDriver, userId, balanceId FROM driver WHERE userId = :id LIMIT 1");
                $stmtDrvUser->execute([':id' => $driverId]);
                $driver = $stmtDrvUser->fetch(\PDO::FETCH_ASSOC);
            }

            if (!$driver) {
                throw new Exception("Motorista não encontrado");
            }

            $balanceId = !empty($driver['balanceId']) ? (int)$driver['balanceId'] : 0;

            // 2. Criar registro em balance caso não exista
            if ($balanceId <= 0) {
                $stmtNewB = $pdo->prepare("
                    INSERT INTO balance (balance, blockedBalance, blockedBalanceToPay, tripBalance, withheldBalance)
                    VALUES (0.00, 0.00, 0.00, 0.00, 0.00)
                ");
                $stmtNewB->execute();
                $balanceId = (int)$pdo->lastInsertId();

                $stmtUpDrv = $pdo->prepare("UPDATE driver SET balanceId = :balanceId WHERE idDriver = :idDriver");
                $stmtUpDrv->execute([':balanceId' => $balanceId, ':idDriver' => (int)$driver['idDriver']]);
            }

            // 3. Obter saldo atual com lock
            $stmtBal = $pdo->prepare("SELECT idBalance, balance FROM balance WHERE idBalance = :id LIMIT 1 FOR UPDATE");
            $stmtBal->execute([':id' => $balanceId]);
            $bal = $stmtBal->fetch(\PDO::FETCH_ASSOC);

            if (!$bal) {
                $stmtNewB = $pdo->prepare("
                    INSERT INTO balance (balance, blockedBalance, blockedBalanceToPay, tripBalance, withheldBalance)
                    VALUES (0.00, 0.00, 0.00, 0.00, 0.00)
                ");
                $stmtNewB->execute();
                $balanceId = (int)$pdo->lastInsertId();

                $stmtUpDrv = $pdo->prepare("UPDATE driver SET balanceId = :balanceId WHERE idDriver = :idDriver");
                $stmtUpDrv->execute([':balanceId' => $balanceId, ':idDriver' => (int)$driver['idDriver']]);

                $stmtBal = $pdo->prepare("SELECT idBalance, balance FROM balance WHERE idBalance = :id LIMIT 1 FOR UPDATE");
                $stmtBal->execute([':id' => $balanceId]);
                $bal = $stmtBal->fetch(\PDO::FETCH_ASSOC);
            }

            $currentBalance = (float)($bal['balance'] ?? 0);
            $newBalance = round($currentBalance + $value, 2);

            // 4. Atualizar balance
            $stmtUpd = $pdo->prepare("UPDATE balance SET balance = :balance WHERE idBalance = :idBalance");
            $stmtUpd->execute([
                ':balance' => $newBalance,
                ':idBalance' => $balanceId
            ]);

            // 5. Inserir registro em balanceFlow
            try {
                $flowType = $value >= 0 ? 1 : 2;
                $stmtFlow = $pdo->prepare("
                    INSERT INTO balanceFlow (`date`, `value`, `balanceFlowTypeId`, `balanceId`, `observation`)
                    VALUES (NOW(), :val, :type, :balanceId, :obs)
                ");
                $stmtFlow->execute([
                    ':val' => abs($value),
                    ':type' => $flowType,
                    ':balanceId' => $balanceId,
                    ':obs' => $observation
                ]);
            } catch (\Throwable $tf) {
                // Registro de fluxo opcional
            }

            echo $this->returnSuccess("O saldo foi atualizado!", [
                'driverId' => (int)$driver['idDriver'],
                'balanceId' => $balanceId,
                'previousBalance' => $currentBalance,
                'newBalance' => $newBalance,
                'balance' => $newBalance
            ]);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao alterar o saldo do motorista");
        }
    }
}