<?php

namespace app\controllers;

use app\dao\ConfigDao;
use Exception;

class CustomerRegisterController extends ApiController
{
    public function actionGetUnblockedConfig()
    {
        try {
            $dao = new ConfigDao();
            $config = $dao->findByKey('customer_register_unblocked');
            
            $result = [
                'customer_register_unblocked' => $config ? $config['value'] : '0'
            ];

            echo $this->returnSuccess("Configuração encontrada", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configuração");
        }
    }
}