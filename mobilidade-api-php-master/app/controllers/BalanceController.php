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
            echo $this->returnSuccess("Últimas movimentações do motorista",
                (new DriverBalanceFlowViewDao)
                    ->lastDriverTransactions($this->request()->driverId)
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
}