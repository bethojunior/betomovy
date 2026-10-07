<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 11/06/2019
 * Time: 20:39
 */

class CentralController extends View
{

    public function actionAdd()
    {

        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            ['central/add'],
            [
                'service/MapService',
                'controllers/SettingsController',
                'controllers/CentralController',
                'modulos/central/add'
            ],
            ['central/add']);
    }

    public function actionIndex()
    {
        $this->nameView = "Listagem das centrais";
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'central/list'
            ],
            [
                'controllers/TripTypeController',
                'controllers/CentralController',
                'controllers/CentralUserController',
                'modulos/central/list'
            ],
            [
                'central/list'
            ]
        );
    }

    public function actionEdit()
    {
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'central/edit'
            ],
            [
                'service/MapService',
                'controllers/SettingsController',
                'controllers/CentralController',
                'modulos/central/edit'
            ],
            [
                'central/add'
            ]
        );
    }

    public function actionListCustomer()
    {
        $this->nameView = "Usuários das centrais";
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'central/listCustomer'
            ],
            [
                'controllers/CentralUserController',
                'modulos/central/listCustomer'
            ],
            [
                'central/listCustomer'
            ]
        );
    }
    public function actionNeighborhoods()
    {
        $this->nameView = "Bairros cadastrados na central";
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'central/neighborhoods'
            ],
            [
                "service/MapService",
                'controllers/CentralNeighborhoodsController',
                'modulos/central/neighborhoods'
            ],
        );
    }

    public function actionSetting()
    {
        $this->nameView = "Configurações central";
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'central/setting'
            ],
            [
                'controllers/BeesCentralController',
                'controllers/MapSettingController',
                'controllers/CentralVoucherPurchasePaymentController',
                'controllers/TripTypeController',
                'controllers/CentralController',
                'modulos/central/setting'
            ]
        );
    }
}