<?php

namespace app\controllers;

use app\services\ManagerPartnerService;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/06/2019
 * Time: 19:11
 */
class ManagerPartnerController extends ApiController
{
    public function actionFindByEmail()
    {
        try {
            echo $this->returnSuccess("Parceiro encontrado",
                (new ManagerPartnerService)->findUserPartnerByEmail(
                    $this->requestQuery(), Headers::getUserId())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar parceiro");
        }
    }

    public function actionStorePartner()
    {
        try {
            echo $this->returnSuccess("Parceiro vinculado com sucesso",
                (new ManagerPartnerService)->store(
                    $this->request(false), Headers::getUserId())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao vincular parceiro");
        }
    }

    public function actionPartners()
    {
        try {
            echo $this->returnSuccess("Parceiros encontrados com sucesso",
                (new ManagerPartnerService)->findPartners(
                    $this->requestQuery(), Headers::getUserId())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar parceiros");
        }
    }

    public function actionBilling()
    {
        try {
            $query_request = $_GET;

            echo $this->returnSuccess(
                "Faturamento gerado com sucesso",
                (new ManagerPartnerService)->billing($query_request, Headers::getUserId()));
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar faturamento do gestor');
        }
    }

    public function actionCitiesWithBilling()
    {
        try {
            echo $this->returnSuccess(
                "Cidades com faturamento encontradas",
                (new ManagerPartnerService)->citiesWithBilling(Headers::getUserId()));
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar cidades com faturamento');
        }
    }

    public function actionPartnersWithBilling()
    {
        try {
            echo $this->returnSuccess(
                "Motoristas com faturamento encontradas",
                (new ManagerPartnerService)->partnersWithBilling(Headers::getUserId()));
        } catch (Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar motoristas com faturamento');
        }
    }
}