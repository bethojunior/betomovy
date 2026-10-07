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
}