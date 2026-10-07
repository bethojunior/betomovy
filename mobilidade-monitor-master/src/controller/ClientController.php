<?php
/**
 * Created by PhpStorm.
 * User: Betho
 * Date: 14/02/2019
 * Time: 10:29
 */

class ClientController extends View
{

    public function actionList()
    {

        try {
            //$this->verifyPermission(GroupConst::CLIENTE, 'listar');

            $this->nameView = "Listagem cliente";
            $this->layoutBuilder(
                [
                    "menu/index",
                    "customer/init"
                ],
                [
                    "controllers/MonitorController",
                    "controllers/Cliente/ClienteController",
                    "controllers/SettingController",
                    "controllers/VoucherController",
                    "modulos/menu/index",
                    "modulos/cliente/init",
                ],
                [
                    "menu/index",
                    "cliente/init"
                ]
            );
        } catch (Exception $exception) {}

    }

    public function actionInsertlegal()
    {

        try {

            $this->nameView = "Inserir Pessoa jurídica";
            $this->layoutBuilder(
                [
                    "menu/index",
                    "company/pj"
                ],
                [
                    "controllers/MonitorController",
                    "controllers/Cliente/ClienteController",
                    "controllers/EstateController",
                    "controllers/CustomerController",
                    "controllers/Company/CompanyController",
                    "modulos/menu/index",
                    "modulos/company/pj",
                ],
                [
                    "menu/index",
                    "cliente/pj"
                ]
            );
        } catch (Exception $exception) {}

    }

    public function actionlegal()
    {
        try {
            $this->nameView = "Listagem Pessoa jurídica";
            $this->layoutBuilder(
                [
                    "menu/index",
                    "company/legal"
                ],
                [
                    "controllers/MonitorController",
                    "controllers/Cliente/ClienteController",
                    "controllers/EstateController",
                    "controllers/CustomerController",
                    "controllers/Company/CompanyController",
                    "modulos/menu/index",
                    "modulos/company/legal",
                ],
                [
                    "menu/index",
                    "cliente/legal"
                ]
            );
        } catch (Exception $exception) {}

    }

    public function actionRemoveAccountRequest()
    {
        try {
            $this->nameView = "Solicitação de Exclusão da Conta";
            $this->layoutBuilder(
                [
                    "menu/index",
                    "customer/removeAccountRequestList"
                ],
                [
                    "controllers/Cliente/ClienteController",
                    "modulos/user/removeAccountRequestList",
                    "modulos/menu/index",
                ],
                [
                    "menu/index"
                ]
            );
        } catch (Exception $exception) {}

    }

}