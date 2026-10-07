<?php


class DeliveryController extends View
{

    public function actionCreate()
    {
        $this->layoutBuilder
        (
            ['delivery/create'],
            [
                'controllers/UserController',
                'controllers/Delivery/DeliveryController',
                'modulos/delivery/create',
            ],
            [
                'delivery/create'
            ]
        );
    }


    public function actionProfile()
    {
        $this->setTemplate(Template::defaultView());
        $this->nameView = "Perfil do painel";
        $this->layoutBuilder
        (
            ["menu/index", 'delivery/profile'],
            [
                "controllers/ConfigController",
                "controllers/MapSettingController",
                'modulos/delivery/profile',
            ],
            [
                'delivery/profile'
            ]
        );
    }

    public function actionRegister()
    {
        $this->setTemplate(Template::defaultView());
        $this->nameView = "Cadastro de estabelecimento";
        $this->layoutBuilder
        (
            [
                'delivery/register'],
            [
                'controllers/SettingsController',
                'controllers/Company/CompanyController',
                'modulos/delivery/register',
            ],
            [
                'delivery/register'
            ]
        );
    }

    public function actionFinancial()
    {
        $this->setTemplate(Template::defaultView());
        $this->nameView = "Gestão financeira";
        $this->layoutBuilder
        (
            ['delivery/financial'],
            [
                'controllers/DeliveryPaymentFormController',
                'controllers/SettingsController',
                'controllers/Company/CompanyController',
                'controllers/EstablishmentCollectionManagementController',
                'modulos/delivery/financial',
            ],
            [
                "delivery/financial"
            ]
        );
    }

    public function actionConfig()
    {
        $this->setTemplate(Template::defaultView());
        $this->nameView = "Configurações gerais";
        $this->layoutBuilder
        (
            [   'delivery/config'
            ],
            [
                "controllers/MapSettingController",
                'modulos/delivery/config',
            ]
        );
    }

    public function actionZone()
    {
        $this->setTemplate(Template::defaultView());
        $this->nameView = "Zonas de entrega";
        $this->layoutBuilder(
            [
                "delivery/zone"
            ],
            [
                "service/MapService",
                "controllers/DeliveryNeighborhoodController",
                "modulos/delivery/zone"
            ]);
    }

    public function actionSettingCalled()
    {
        $this->setTemplate(Template::defaultView());
        $this->nameView = "Configuração do chamando";
        $this->layoutBuilder(
            ["delivery/settingCalled"],
            [
                "controllers/DeliveryCallConfigController",
                "modulos/delivery/settingCalled"
            ]);
    }

    public function actionDriverAttachmentType()
    {
        $this->setTemplate(Template::defaultView());
        $this->nameView = "Acessórios de entrega";
        $this->layoutBuilder(
            ["delivery/driverAttachmentType"],
            [
                "controllers/DriverAttachmentTypeController",
                "modulos/delivery/driverAttachmentType"

            ]
        );
    }

    public function actionRegisterCategoryEstablishment() {
        $this->setTemplate(Template::defaultView());
        $this->nameView= "Categorias de estabelecimentos";
        $this->layoutBuilder(
          ["delivery/categoryEstablishment"],
          [
              "controllers/DeliverySectionController",
              "controllers/CategoryEstablishmentController",
              "modulos/delivery/categoryEstablishment"
          ],
          ["delivery/categoryEstablishment"]
        );
    }

    public function actionRate()
    {
        $this->nameView = "Taxas e tempo";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "delivery/rate"
            ],
            [
                "controllers/DeliveryRateController",
                "modulos/delivery/rate"
            ]
        );
    }

    public function actionAcquirerConfiguration()
    {
        $this->nameView = "Configuração de Adquirente ASAAS";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "delivery/configurationAcquirer"
            ],
            [
                "controllers/DeliveryRateController",
                "modulos/delivery/configurationAcquirer"
            ]);
    }

    public function actionRateDobby()
    {
        $this->nameView = "Taxas de devolução da maquineta";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "delivery/rateDobby"
            ],
            [
                "controllers/DeliveryRateController",
                "modulos/delivery/rateDobby"
            ]
        );
    }

    public function actionCharge()
    {
        $this->nameView = "Listagem de cobranças";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "delivery/charge"
            ],
            [
                "controllers/DeliveryChargeController",
                "modulos/delivery/charge"
            ]
        );
    }

    public function actionMonitoring()
    {
        $this->nameView = "Monitoramento de delivery";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "delivery/monitoring"
            ],
            [
                "controllers/DeliveryMonitoring",
                "service/MapService",
                "modulos/delivery/monitoring"
            ],
            [
              "delivery/monitoring"
            ]
        );
    }

    public function actionSections()
    {
        $this->nameView = "Seções";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "delivery/section"
            ],
            [
                "controllers/DeliverySectionController",
                "modulos/delivery/section"
            ]
        );
    }

    public function actionDeliveryConfiguration()
    {
        $this->nameView = "Configuração Delivery";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "delivery/deliveryConfiguration"
            ],
            [
                "controllers/Delivery/DeliveryController",
                "modulos/delivery/deliveryConfiguration"
            ]
        );
    }

    public function actionAcquirerDelivery()
    {
        $this->nameView = "Adquirentes";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "delivery/acquirerDelivery"
            ],
            [
                "controllers/DeliveryAcquirer",
                "modulos/delivery/acquirerDelivery"
            ]
        );
    }
}
