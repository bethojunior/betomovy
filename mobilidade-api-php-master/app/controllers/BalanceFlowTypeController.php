<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class BalanceFlowTypeController extends ApiController
{
    public function actionIndex()
    {
        return $this->actionSearchable();
    }

    public function actionSearchable()
    {
        try {
            $sql = "SELECT idBalanceFlowType, name, flow, flowId, balanceFlowReferenceId 
                    FROM balanceFlowType 
                    ORDER BY idBalanceFlowType ASC";
            $rows = GenericDao::query($sql);
            $result = [];

            foreach ($rows as $row) {
                $row['idBalanceFlowType'] = (int)$row['idBalanceFlowType'];
                $row['flowId'] = (int)$row['flowId'];
                $row['balanceFlowReferenceId'] = (int)$row['balanceFlowReferenceId'];
                $result[] = $row;
            }

            echo $this->returnSuccess("Tipos de movimentação de saldo", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
