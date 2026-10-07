<?php
/**
 * Created by PhpStorm.
 * User: Betho
 * Date: 20/02/2019
 * Time: 14:38
 */

class FinancialController extends View
{
    public function actionList()
    {
        $this->nameView = "Listagem Financeira";
        $this->layoutBuilder(
            [
                "menu/index",
                "financeiro/list"
            ],
            [
                "controllers/WithdrawController",
                "controllers/AcquirerController",
                "modulos/menu/index",
                "modulos/financial/list",
            ],
            [
                "menu/index",
                "financial/list"
            ]
        );
    }

    public function actionrelatorios()
    {
        $this->nameView = "Listagem Financeira";
        $this->layoutBuilder(
            [
                "menu/index",
                "financeiro/relatorio"
            ],
            [
                "controllers/UserController",
                "controllers/FinancialController",
                "Request/Report/indication",
                "Validate/Report/indication",
                "modulos/menu/index",
                "modulos/financial/relatorio",
            ],
            [
                "menu/index",
                "financial/relatorio"
            ]
        );
    }

    public function actionCharge()
    {
        $this->nameView = "Cobranças";
        $this->layoutBuilder(
            [
                "menu/index",
                "financeiro/charge"
            ],
            [
                "controllers/UserController",
                "controllers/PaymentFormController",
                "controllers/FinancialController",
                "controllers/DriverController",
                "controllers/TripTypeController",
                "controllers/ConfigAllController",
                "modulos/menu/index",
                "modulos/financial/charge",
                "modulos/prepaid/manager",
                "controllers/MapSettingController",
            ],
            [
                "menu/index",
                "financial/charge"
            ]
        );
    }

    public function actionComission()
    {
        $this->nameView = "Comissão";
        $this->layoutBuilder(
            [
                "menu/index",
                "financeiro/comission"
            ],
            [
                "controllers/UserController",
                "controllers/FinancialController",
                "controllers/TripTypeController",
                "modulos/menu/index",
                "modulos/financial/comission",
            ],
            [
                "menu/index",
                "financial/comission"
            ]
        );
    }

    public function actionCancellationFee()
    {
        $this->nameView = "Taxa de cancelamento";
        $this->layoutBuilder(
            [
                "menu/index",
                "financeiro/cancellationFee"
            ],
            [
                "controllers/UserController",
                "controllers/DriverController",
                "controllers/CustomerController",
                "controllers/FinancialController",
                "Validate/Financial/cancellationFee",
                "Request/Financial/cancellationFee",
                "controllers/TripTypeController",
                "modulos/menu/index",
                "modulos/financial/cancellationFee",
            ],
            [
                "menu/index",
                "financial/cancellationFee"
            ]
        );
    }

    public function actionPriceRange()
    {
        $this->nameView = "Faixa de preço";
        $this->layoutBuilder(
            [
                "menu/index",
                "financeiro/priceRange"
            ],
            [
                "controllers/FinancialController",
                "controllers/PriceController",
                "modulos/menu/index",
                "modulos/financial/priceRange",
            ],
            [
                "menu/index",
                "financial/priceRange"
            ]
        );
    }

    public function actiondriverProduction()
    {
        $this->nameView = "Relatório Financeiro de Produção do Motorista ";
        $this->layoutBuilder(
            [
                "menu/index",
                "financeiro/driverProduction"
            ],
            [
                "controllers/FinancialController",
                "controllers/PriceController",
                "modulos/menu/index",
                "modulos/financial/driverProduction",
            ],
            [
                "menu/index",
                "financial/driverProduction"
            ]
        );
    }

    public function actionPrepaid()
    {
        $this->nameView = "Pré-Pago";

        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "prepaid/index"
            ],
            [
                "controllers/PrepaidController",
                "modulos/prepaid/list"
            ]
        );
    }



    public function actionBoleto()
    {
        $this->nameView = "Emissão de boletos";
        $this->layoutBuilder(
            [
                "menu/index",
                "financeiro/boleto"
            ],
            [
                "controllers/FinancialController",
                "controllers/DriverController",
                "controllers/PriceController",
                "modulos/menu/index",
                "modulos/financial/boleto",
            ],
            [
                "menu/index",
                "financial/driverProduction"
            ]
        );
    }

}