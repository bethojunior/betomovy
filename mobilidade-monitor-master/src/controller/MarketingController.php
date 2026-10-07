<?php
/**
 * Created by PhpStorm.
 * User: Betho
 * Date: 18/02/2019
 * Time: 11:05
 */

class MarketingController extends View
{

    public function actionDriver(){
        $this->nameView = "Pre cadastro motorista";
        $this->layoutBuilder(
            [
                "menu/index",
                "driver/marketing"
            ],
            [
                "controllers/MonitorController",
                "controllers/DriverController",
                "modulos/menu/index",
                "modulos/driver/marketing",
            ],
            [
                "menu/index",
                "driver/marketing"
            ]
        );
    }

    public function actionPush()
    {
        $this->nameView = "Envio de notificações";
        $this->layoutBuilder(
            [
                "menu/index",
                "marketing/push",
            ],
            [
                "controllers/NotificationController",
                "controllers/AdminAnaController",
                "controllers/MonitorController",
                "controllers/DriverController",
                "controllers/CustomerController",
                "modulos/menu/index",
                "modulos/marketing/push",
            ],
            [
                "menu/index",
                "marketing/push",
            ]);
    }

    public function actionSms()
    {
        $this->nameView = "Envio de sms";
        $this->layoutBuilder(
            [
                "menu/index",
                "driver/massageUser",
            ],
            [
                "controllers/NotificationController",
                "controllers/AdminAnaController",
                "controllers/MonitorController",
                "controllers/DriverController",
                "modulos/menu/index",
                "modulos/home/index",
                "modulos/driver/massageUser",
            ],
            [
                "menu/index",
                "driver/massageUser",
            ]);
    }

    public function actionPublicidade()
    {
        $this->nameView = "Cadastro de publicidade";
        $this->layoutBuilder(
            [
                "menu/index",
                "marketing/publicidade",
            ],
            [
                "controllers/Marketing/Controller",
                "controllers/Config/ConfigController",
                "controllers/Company/CompanyController",
                "controllers/NotificationController",
                "controllers/AdminAnaController",
                "controllers/MonitorController",
                "controllers/DriverController",
                "modulos/menu/index",
                "modulos/marketing/publicity",
            ],
            [
                "menu/index",
                "marketing/publicity",
            ]);
    }

    public function actionListPublicidade()
    {
        $this->nameView = "Listagem de publicidade";
        $this->layoutBuilder(
            [
                "menu/index",
                "marketing/list-publicity",
            ],
            [
                "controllers/Marketing/Controller",
                "controllers/Config/ConfigController",
                "controllers/Company/CompanyController",
                "controllers/NotificationController",
                "controllers/AdminAnaController",
                "controllers/MonitorController",
                "controllers/DriverController",
                "modulos/menu/index",
                "modulos/marketing/list-publicity",
            ],
            [
                "menu/index",
                "marketing/list-publicity",
            ]);
    }

    public function actionMenuLinkExternal()
    {
        $this->nameView = "Link para menu externo";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "marketing/menuLinkExternal"
            ],
            [
                "controllers/MenuLinkExternalController",
                "modulos/marketing/menuLinkExternal",
            ],
            [
                "marketing/menu-link-external"
            ]);
    }

    public function actionCupom()
    {
        $this->nameView = "Cupom de desconto";
        $this->layoutBuilder(
            [
                "menu/index",
                "marketing/cupom",
            ],
            [
                "controllers/CityController",
                "controllers/TripPaymentFormController",
                "controllers/CustomerController",
                "controllers/NotificationController",
                "controllers/AdminAnaController",
                "controllers/MonitorController",
                "controllers/Marketing/Controller",
                "modulos/menu/index",
                "modulos/marketing/cupom",
            ],
            [
                "menu/index",
                "marketing/cupom",
            ]);
    }

    public function actionListCupom()
    {
        $this->nameView = "Listagem de Cupons";
        $this->layoutBuilder(
            [
                "menu/index",
                "marketing/listCupom",
            ],
            [
                "controllers/TripPaymentFormController",
                "controllers/CustomerController",
                "controllers/MonitorController",
                "controllers/Marketing/Controller",
                "modulos/menu/index",
                "modulos/marketing/listCupom",
            ],
            [
                "menu/index",
                "marketing/listCupom",
            ]);
    }

}