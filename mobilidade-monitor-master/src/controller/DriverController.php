<?php

/**
 * Created by PhpStorm.
 * User: Betho
 * Date: 19/02/2019
 * Time: 10:55
 */

class DriverController extends View
{

    public $idDriver;

    public function actionList()
    {
        try {
            $this->nameView = "Listagem Motorista";
            $this->layoutBuilder(
                [
                    "menu/index",
                    "driver/init"
                ],
                [
                    "controllers/MonitorController",
                    "controllers/DriverController",
                    "controllers/TripPaymentFormController",
                    "controllers/SettingController",
                    "controllers/AdditionalSettingsController",
                    "modulos/menu/index",
                    "modulos/driver/filterDriverFormOfPayment",
                    "modulos/driver/init",
                    "modulos/driver/util"
                ],
                [
                    "menu/index",
                    "driver/init"
                ]
            );
        } catch (Exception $exception) {
        }
    }

    public function listByOneDriver()
    {
        try {

            $this->verifyPermission(GroupConst::MOTORISTA, "listar");

            $this->nameView = "Listagem de corrida do <b id='driverName'></b>";
            $this->layoutBuilder(
                [
                    "menu/index",
                    "driver/listTrip"
                ],
                [
                    "controllers/MonitorController",
                    "controllers/DriverController",
                    "modulos/menu/index",
                    "modulos/driver/util",
                    "modulos/driver/listTrip",
                ],
                [
                    "menu/index",
                    "driver/listTrip"
                ]
            );
        } catch (Exception $exception) {
        }
    }


    public function actionEdit()
    {
        try {
            $this->verifyPermission('motorista', 'editar');

            $this->nameView = 'Editar dados do motorista';

            $this->layoutBuilder(
                [
                    "menu/index",
                    "driver/edit"
                ],
                [
                    "controllers/TripTypeController",
                    "controllers/DriverController",
                    "controllers/DocumentController",
                    "modulos/menu/index",
                    "modulos/driver/util",
                    "modulos/driver/edit",
                ],
                [
                    "menu/index",
                    "driver/edit"
                ]
            );
        } catch (Exception $exception) {
        }
    }

    public function actionGet()
    {
        $this->addEvents(
            [
                'list' => 'listByOneDriver',
                'edit' => 'actionEdit',
                'financial' => 'financial',
                'report' => 'report'
            ]
        );
    }

    public function financial()
    {
        try {
            $this->verifyPermission(GroupConst::MOTORISTA, "financeiro");

            $this->nameView = 'Financeiro do Motorista';
            $this->layoutBuilder(
                [
                    "menu/index",
                    "driver/modalFilterFinancial",
                    "driver/financial",
                ],
                [
                    "controllers/DriverController",
                    "modulos/menu/index",
                    "modulos/driver/financial",
                ],
                [
                    "menu/index",
                    "driver/financial",
                    "driver/modalFinancial",
                ]
            );
        } catch (Exception $exception) {
        }
    }


    public function report()
    {
        $this->nameView = 'Financeiro do Motorista';
        $this->layoutBuilder(
            [
                "driver/printFinancial"
            ],
            [
                "controllers/DriverController",
                "modulos/driver/reportFinancial",
            ],
            [
                "driver/printFinancial",
            ]
        );
    }


    public function actionSignUp()
    {
        try {
            $this->verifyPermission(GroupConst::MOTORISTA, "cadastro");

            $this->setTemplate(Template::defaultView());

            $this->nameView = 'Cadastro de Motorista';

            $this->layoutBuilder(
                [
                    'driver/signup'
                ],
                [
                    'controllers/ManagerController',
                    'controllers/DriverController',
                    'controllers/SupportController',
                    'controllers/EstateController',
                    'controllers/StationTypeController',
                    'controllers/UserController',
                    'controllers/RequiredFieldController',
                    "controllers/FormStepController",
                    "controllers/DocUserTypeController",
                    'service/MapService',
                    'modulos/driver/signup',
                    'modulos/validator/validateSignup'
                ],
                [
                    'driver/signup'
                ]
            );
        } catch (Exception $exception) {
        }
    }


    public function actionInsertCar()
    {
        $this->nameView = 'Adcionar carro';
        $this->layoutBuilder(
            [
                "menu/index",
                "driver/insertCar"
            ],
            [
                "modulos/menu/index",
                "controllers/DriverController",
                'controllers/UserController',
                "modulos/driver/insertCar",
            ],
            [
                "menu/index",
                "driver/insertCar",
            ]
        );
    }

    public function actionMonitoring()
    {
        $this->layoutBuilder(
            ["driver/monitoring"],
            [
                "controllers/DriverController",
                "service/MapService",
                "modulos/driver/monitoring"
            ],
            ["driver/monitoring"]
        );
    }


    public function actionDocument()
    {
        $this->nameView = "Documentos por categoria";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "driver/document"
            ],
            [
                "controllers/DocumentController",
                "controllers/UserController",
                "modulos/driver/document"
            ]
        );
    }
}
