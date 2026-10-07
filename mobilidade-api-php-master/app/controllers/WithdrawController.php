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