<?php

namespace app\controllers;
use app\dao\WithdrawDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/09/2018
 * Time: 11:35
 */
class WithdrawController extends ApiController
{
    public function actionIndex()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        if ($method === 'PUT' || $method === 'POST') {
            try {
                $id = $_GET['id'] ?? null;
                if ($id) {
                    $db = \app\utils\Connection::getConnection(\app\utils\Connection::DB_MYSQL_RW);
                    $stmt = $db->prepare("UPDATE withdraw SET paymentDate = NOW() WHERE idWithdraw = :id");
                    $stmt->execute([':id' => $id]);
                }
                echo $this->returnSuccess("Transferência confirmada com sucesso");
            } catch (Exception $e) {
                echo $this->returnError($e, "Erro ao confirmar transferência");
            }
            return;
        }

        try {
            $data = (new WithdrawDao)->getAll();
            echo $this->returnSuccess("Solicitações de transferências", [
                'data' => $data ?: [],
                'last_page' => 1
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao capturar listagens de transferências.");
        }
    }

    public function actionNew()
    {
        try {
            echo $this->returnSuccess("Transferencia solicitada",
                (new WithdrawDao)->new($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao solicitar transferência");
        }
    }

    public function actionList()
    {
        try {
            echo $this->returnSuccess("Solicitações de transferências",
                (new WithdrawDao)->getAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFind()
    {
        try {
            $withdraw = $this->request();

            echo $this->returnSuccess("Busca de transferência",
                (new WithdrawDao)->find($withdraw->confirmationCode)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}