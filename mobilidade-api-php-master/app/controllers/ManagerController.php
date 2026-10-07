<?php

namespace app\controllers;

use app\services\ManagerService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/06/2019
 * Time: 15:24
 */
class ManagerController extends ApiController
{
    public function actionGetIndicated()
    {
        try {
            echo $this->returnSuccess(
                "Listando usuáarios indicados",
                (new ManagerService)
                    ->getIndicated(Headers::getUserId(), $this->requestQuery()));
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao listar usuários indicados');
        }
    }

    public function actionBilling()
    {
        try {
            $query_request = $_GET;

            echo $this->returnSuccess(
                "Faturamento gerado com sucesso",
                (new ManagerService)->billing($query_request, Headers::getUserId()));
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar faturamento do gestor');
        }
    }

    public function actionCitiesWithBilling()
    {
        try {
            echo $this->returnSuccess(
                "Cidades com faturamento encontradas",
                (new ManagerService)->citiesWithBilling(Headers::getUserId()));
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar cidades com faturamento');
        }
    }

    public function actionDriversWithBilling()
    {
        try {
            echo $this->returnSuccess(
                "Motoristas com faturamento encontradas",
                (new ManagerService)->driversWithBilling(Headers::getUserId()));
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar motoristas com faturamento');
        }
    }

    public function actionLogin()
    {
        try {
            echo $this->returnSuccess("Login efetuado",
                (new ManagerService)->login($this->request(false)));
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao autenticar usuário');
        }
    }
}