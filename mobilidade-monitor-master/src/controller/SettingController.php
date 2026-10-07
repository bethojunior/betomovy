<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 23/01/2019
 * Time: 13:56
 */


class SettingController extends View
{

    protected $idCity;

    public function actionApp()
    {
        $this->nameView = "Configurações do app";
        $this->layoutBuilder(
            [

                "menu/index",
                "setting/app",
            ],
            [
                "controllers/PriceController",
                "controllers/AdminController",
                "controllers/DriverController",
                "controllers/TripTypeController",
                "controllers/SettingsController",
                "controllers/Item/ItemController",
                "modulos/menu/index",
                "modulos/setting/app",
            ],
            [
                "menu/index",
                "setting/app"
            ]
        );
    }

    public function actionCities()
    {
        $this->nameView = "Configurações por cidade";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [

                "setting/cities",
            ],
            [
                "service/Timezones",
                "controllers/SettingController",
                "controllers/TripTypeController",
                "modulos/setting/cities",
            ],
            [
                "setting/cities"
            ]
        );
    }

    public function actionKeys()
    {
        try {
            $this->verifyPermission(GroupConst::CONFIGURACAO, 'config_app');
            $this->nameView = "Configurações das chaves do app";
            $this->layoutBuilder(
                [
                    "menu/index",
                    "setting/keys",
                ],
                [
                    "service/Timezones",
                    "controllers/PriceController",
                    "controllers/AdminController",
                    "controllers/MapSettingController",
                    "modulos/menu/index",
                    "modulos/setting/keys",
                ],
                [
                    "menu/index",
                    "setting/keys"
                ]
            );
        } catch (Exception $exception) {
        }
    }

    public function actionModulesActive()
     {
         $this->nameView = "Modulos Ativos";
         $this->setTemplate(Template::defaultView());
         $this->layoutBuilder([
             "setting/modulesActive",
         ],
         [
             "controllers/RiskAreaController",
             "controllers/ModulesActiveController",
             "modulos/setting/modulesActive"
         ],
         [
             "setting/modulesActive"
         ]
     );
     }

    public function actionIndex()
    {
        $this->nameView = "Configurações Gerais";

        $this->layoutBuilder(
            [
                "menu/index",
                'setting/general'
            ],
            [
                "controllers/ConfigController",
                "modulos/menu/index",
                "modulos/setting/general",
            ],
            [
                "menu/index",
                'setting/general'
            ]

        );
    }


    public function actionRates()
    {
        $this->nameView = "Tarifas";
        $this->layoutBuilder
        (
            [
                "menu/index",
                "setting/add-rate"
            ],
            [
                'service/MapService',
                "controllers/DriverCommissionController",
                "controllers/MonitorController",
                "controllers/EstateController",
                "controllers/PriceController",
                "controllers/TripTypeController",
                "controllers/TripPaymentFormController",
                "modulos/menu/index",
                "modulos/setting/rates",
                "modulos/setting/add-rate",
            ],
            [
                "menu/index",
                "setting/rates",
                "setting/add-rate"
            ]
        );
    }

    public function actionAddRates()
    {

        $params = explode("/", $_SERVER['REQUEST_URI']);
        $this->idCity = $params[count($params) - 1];

        $this->nameView = "Atualizar Tarifa";
        $this->layoutBuilder
        (
            [
                "menu/index",
                "setting/add-rate"
            ],
            [
                "controllers/MonitorController",
                "controllers/TripTypeController",
                "controllers/PriceController",
                "modulos/menu/index",
                "modulos/setting/add-rate",
            ],
            [
                "menu/index",
                "setting/add-rate"
            ]
        );
    }

    public function actionTrigger()
    {
        $this->nameView = "Gatilho de Tarifa";

        $this->layoutBuilder
        (
            [
                "menu/index",
                "setting/trigger"
            ],
            [
                "controllers/EstateController",
                "controllers/TriggerController",
                "modulos/menu/index",
                "modulos/setting/trigger",
            ],
            [
                "menu/index",
                "setting/trigger"
            ]
        );

    }

    public function actionTriggerLabel()
    {
        $this->nameView = "Gatilho de Bandeira de Tarifa";

        $this->layoutBuilder
        (
            [
                "menu/index",
                "setting/triggerLabel"
            ],
            [
                "controllers/EstateController",
                "controllers/TriggerController",
                "modulos/menu/index",
                "modulos/setting/triggerLabel",
            ],
            [
                "menu/index",
                "setting/triggerLabel"
            ]
        );

    }

    public function actionDynamicByArea()
    {
        $this->nameView = "Dinâmica por área";
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder
        (
            [
                "setting/dynamicByArea"
            ],
            [
                "service/MapService",
                'controllers/DynamicByAreaController',
                'modulos/setting/dynamicByArea'

            ],
        );

    }

    public function actionAdmin()
    {

        $params = explode("/", $_SERVER['REQUEST_URI']);
        $this->idCity = $params[count($params) - 1];

        $this->nameView = "Administradores";
        $this->layoutBuilder(
            [

                "menu/index",
                "admin/list",
                "admin/add",
            ],
            [
                "controllers/RulesController",
                "controllers/AdminController",
                "modulos/menu/index",
                "modulos/admin/list",
                "modulos/admin/add",
            ],
            [
                "menu/index",
                "admin/list",
                "admin/add",
            ]
        );
    }

    public function actionRadius()
    {

        $this->nameView = "Raio de chamado";
        $this->layoutBuilder(
            [

                "menu/index",
                "setting/radius",
            ],
            [
                "controllers/SettingController",
                "Request/Setting/radius",
                "Validate/Setting/radius",
                "modulos/menu/index",
                "modulos/setting/radius",
            ],
            [
                "menu/index",
                "setting/radius",
            ]
        );
    }

    public function actionVersion()
    {

        $this->nameView = "Versão";
        $this->layoutBuilder(
            [

                "menu/index",
                "setting/version",
            ],
            [
                "controllers/SettingsController",
                "modulos/menu/index",
                "modulos/setting/version",
            ],
            [
                "menu/index",
                "setting/version",
            ]
        );
    }

    public function actionTerms()
    {
        $this->nameView = "Termos";
        $this->layoutBuilder(
            [

                "menu/index",
                "setting/terms",
            ],
            [
                "controllers/SettingsController",
                "modulos/menu/index",
                "modulos/setting/terms",
            ],
            [
                "menu/index",
                "setting/terms",
            ]
        );
    }

    public function actionNotification()
    {
        $this->nameView = "Notificações";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [

                "notifications/list",
            ],
            [
                "modulos/notification/list",
            ],
            [
                "notification/list",
            ]
        );
    }

    public function actionPaymentForm()
    {
        $this->nameView = "Formas de pagamento";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            ["setting/payment-forms"],
            [
                "controllers/SettingsController",
                "modulos/setting/payment-form/list",
                "modulos/setting/payment-form/add"
            ]
        );
    }

    public function actionDocument()
    {
        $this->nameView = "Documentos";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/document"
            ],
            [
                "controllers/DocumentController",
                "modulos/setting/document"
            ]);
    }


    public function actionGet()
    {
        $this->addEvents(
            [
                'driver' => 'signupDriver',
                'profile/add' => 'addProfile'
            ]);
    }

    public function signupDriver()
    {
        $this->nameView = "Configuração no cadastro do motorista";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/signup/driver"
            ],
            [
                "controllers/UserController",
                "controllers/ConfigController",
                "modulos/setting/signup/driver"
            ],
            [
                "setting/signup/driver"
            ]);
    }

    public function actionProfile()
    {
        $this->nameView = "Perfil";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/profile/index"
            ],
            [
                "controllers/RulesController",
                "modulos/setting/rules/index"
            ]);
    }


    public function actionAddProfile()
    {
        $this->nameView = "Adicionar perfil";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/profile/add"
            ],
            [
                "controllers/RulesController",
                "modulos/setting/rules/add"
            ]);
    }

    public function actionAddress()
    {
        $this->nameView = "Adicionar endereços";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/address"
            ],
            [
                "service/MapService",
                "controllers/AddressController",
                "modulos/setting/address"
            ],
            [
                "setting/address"
            ]);
    }

    public function actionImportClient()
    {
        $this->nameView = "Importação do cliente";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/import/client"
            ],
            [
                "controllers/ImportController",
                "modulos/setting/import/client"
            ]
        );
    }

    public function actionImportDriver()
    {
        $this->nameView = "Importação de motorista";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/import/driver"
            ],
            [
                "controllers/ImportController",
                "controllers/UserController",
                "modulos/setting/import/driver"
            ],
            [
                "setting/import/driver"
            ]
        );
    }

    public function actionPassword()
    {
        $this->nameView = "Alterar Senha";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/password"
            ],
            [
                "controllers/UserController",
                "modulos/setting/password"
            ]);
    }

    public function actionCalled()
    {
        $this->nameView = "Gerenciamento de chamado";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/called",
                "setting/registrationCategory"
            ],
            [
                "controllers/UserController",
                "controllers/CustomerController",
                "controllers/TripTypeController",
                "controllers/UserTypeController",
                'controllers/IconMapController',
                "modulos/setting/registrationCategory",
                "modulos/setting/calledTypeSetting",
                "modulos/tripType/index",
                'modulos/icon/index'
            ],
            [
                "setting/called"
            ]
        );
    }

    /**
     * view messages chatbot driver
     */
    public function actionChatbot()
    {
        $this->nameView = "Mensagens automaticas do motorista";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/chatbot",
            ],
            [
                "controllers/UserController",
                "controllers/TripController",
                "modulos/setting/chatbot",
            ],
            [
                "setting/chatbot"
            ]
        );
    }


    public function actionreasonCancellation()
    {
        $this->nameView = "Motivos de cancelamento";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/reasonCancelation",
            ],
            [
                "controllers/UserController",
                "controllers/TripController",
                "modulos/setting/reasonCancelation",
            ],
            [
                "setting/reasonCancelation"
            ]
        );
    }

    public function actionAddressBlacklist()
    {
        $this->nameView = "Endereços irregulares";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/addressBlacklist"
            ],
            [
                "controllers/AddressBlacklistController",
                "modulos/setting/addressBlacklist"
            ]
        );
    }

    public function actionConfirmationCode()
    {
        $this->nameView = "Código de confirmação";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/confirmationCode"
            ],
            [
                "controllers/ExternalServiceController",
                "modulos/setting/confirmationCode"
            ]
        );
    }

    public function actionAcquirer()
    {
        $this->nameView = "Adquirentes";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/acquirer"
            ],
            [
                "controllers/AcquirerController",
                "modulos/setting/acquirer"
            ]);
    }

    public function actionAcquirerByCity()
    {
        $this->nameView = "Adquirentes por Cidade";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/acquirerByCity"
            ],
            [
                "controllers/AcquirerByCityController",
                "modulos/setting/acquirerByCity"
            ]);
    }

    public function actionAdditionalSettings()
    {
        $this->nameView = "Configurações adicionais";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/additionalAppSettings"
            ],
            [
                "controllers/AdditionalSettingsController",
                "controllers/MapSettingController",
                "modulos/setting/additionalAppSettings"
            ]);
    }

    public function actionToll()
    {
        $this->nameView = "Pedágio";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            ["setting/toll"],
            [
                "service/MapService",
                "controllers/SettingsController",
                "controllers/TollController",
                "modulos/setting/toll"
            ],
            ["setting/toll"]);
    }

    public function actionCacheAddress()
    {
        $this->nameView = "Endereço em cache";
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "setting/cacheAddress"
            ],
            [
                "controllers/AddressController",
                "controllers/AddressBlacklistController",
                "modulos/setting/cacheAddress"
            ]
        );
    }

    public function actionExternalService()
    {
        $this->nameView = "Serviços Externos";
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "setting/externalService"
            ],
            [
                "controllers/ExternalServiceController",
                "modulos/setting/externalService"
            ]
        );
    }

    public function actionPendencyDriver()
    {
        $this->nameView = "Pontuação de penalidade de motoristas";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/pendencyDriver"
            ],
            [
                "controllers/SettingController",
                "modulos/setting/pendencyDriver"
            ],
            [
                "setting/pendencyDriver"
            ]);
    }

    public function actionExternalServicesGlobals()
    {
        $this->nameView = "Serviços externos globais";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/externalServicesGlobals"
            ],
            [
                "controllers/SettingController",
                "modulos/setting/externalServicesGlobals"
            ]);
    }
    
    public function actionExternalServicesByCity()
    {
        $this->nameView = "Serviços externos por cidade";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/externalServicesByCity"
            ],
            [
                "controllers/SettingController",
                "modulos/setting/externalServicesByCity",
            ]
        );
    }

    public function actionSmtp()
    {
        $this->nameView = "Configurações de serviço de E-mail(SMTP)";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/smtpServer"
            ],
            [
                "controllers/SMTPServerController",
                "modulos/setting/smtpServer"
            ]
        );
    }

    public function actionAppConfig()
    {
        $this->nameView = "Configurações de aplicações";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder([
            "setting/appConfig"
        ],
        [
            "controllers/AppConfigController",
            "modulos/setting/appConfig"
        ]);
    }

    public function actionRequiredField()
    {
        $this->nameView = "Obrigatoriedade de campos";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder([
            "setting/requiredField"
        ],
        [
            "controllers/RequiredFieldController",
            "modulos/setting/requiredField"
        ],
        [
            "setting/requiredField"
        ]
    );
    }

}