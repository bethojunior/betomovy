<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class BalancePostingController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];

            if ($method === 'GET') {
                $sql = "SELECT bp.id,
                               bp.userTypeId,
                               bp.balanceFlowTypeId,
                               bp.value,
                               bp.active,
                               bp.billingDay,
                               bp.created_at,
                               bp.updated_at,
                               bft.name AS balanceFlowTypeName,
                               bft.flow,
                               ut.name AS userTypeName
                        FROM balancePosting bp
                        LEFT JOIN balanceFlowType bft ON bft.idBalanceFlowType = bp.balanceFlowTypeId
                        LEFT JOIN userType ut ON ut.idUserType = bp.userTypeId
                        WHERE bp.deleted_at IS NULL
                        ORDER BY bp.id DESC";

                $rows = GenericDao::query($sql);
                $result = [];

                foreach ($rows as $row) {
                    $row['id'] = (int)$row['id'];
                    $row['userTypeId'] = $row['userTypeId'] !== null ? (int)$row['userTypeId'] : null;
                    $row['balanceFlowTypeId'] = (int)$row['balanceFlowTypeId'];
                    $row['value'] = (float)$row['value'];
                    $row['active'] = (int)$row['active'];
                    $row['billingDay'] = $row['billingDay'] !== null ? (int)$row['billingDay'] : null;
                    $result[] = $row;
                }

                echo $this->returnSuccess("Lançamentos de saldo agendados", $result);
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $userTypeId = isset($data->userTypeId) ? (int)$data->userTypeId : null;
                $balanceFlowTypeId = isset($data->balanceFlowTypeId) ? (int)$data->balanceFlowTypeId : null;
                $value = isset($data->value) ? (float)$data->value : 0.0;
                $billingDay = isset($data->billingDay) ? (int)$data->billingDay : 1;
                $active = !empty($data->active) ? 1 : 1;

                if (!$balanceFlowTypeId) {
                    throw new Exception("Tipo de movimentação é obrigatório.");
                }

                GenericDao::execute("INSERT INTO balancePosting (userTypeId, balanceFlowTypeId, value, billingDay, active, created_at, updated_at) 
                                    VALUES (:userTypeId, :balanceFlowTypeId, :value, :billingDay, :active, NOW(), NOW())", [
                    ':userTypeId' => $userTypeId,
                    ':balanceFlowTypeId' => $balanceFlowTypeId,
                    ':value' => $value,
                    ':billingDay' => $billingDay,
                    ':active' => $active
                ]);

                echo $this->returnSuccess("Lançamento agendado com sucesso");
                return;
            }

            if ($method === 'DELETE') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if (!$id) {
                    throw new Exception("ID do agendamento não informado.");
                }

                GenericDao::execute("UPDATE balancePosting SET deleted_at = NOW() WHERE id = :id", [':id' => $id]);
                echo $this->returnSuccess("Agendamento excluído com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao processar lançamentos agendados");
        }
    }
}
