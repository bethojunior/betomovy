<?php

namespace app\controllers;
use app\dao\PartnerBalanceFlowViewDao;
use app\dao\PartnerWithdrawDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/05/2019
 * Time: 18:23
 */
class PartnerBalanceController extends ApiController
{
    public function actionFinancialTransactions()
    {
        try {
            echo $this->returnSuccess("Movimentações financeiras encontradas",
                (new PartnerBalanceFlowViewDao)
                    ->financialTransactions($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionLastTransactions()
    {
        try {
            echo $this->returnSuccess("Últimas movimentações financeiras encontradas",
                (new PartnerBalanceFlowViewDao)
                    ->lastTransactions($this->request(false)->customerId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionWithdraw()
    {
        try {
            echo $this->returnSuccess("Transferência solicitada",
                (new PartnerWithdrawDao)->new($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}