<?php
/**
 * Created by PhpStorm.
 * User: Emerson
 * Date: 15/11/2018
 * Time: 22:11
 */

class CustomerController extends View
{
    public function actionDetail()
    {
        $this->layoutBuilder
        (
            [
                'customer/detail',
            ],
            [
                'service/MapService',
                'controllers/CustomerController',
                'controllers/ChatController',
                'controllers/TripController',
                'modulos/customer/detail',
            ],
            [
                'customer/detail',
            ]
        );
    }

    public function actionMap()
    {
        $this->layoutBuilder
        (
            [
                'customer/map',
            ],
            [
                'service/MapService',
                'controllers/CustomerController',
                'controllers/ChatController',
                'controllers/TripController',
                'modulos/customer/map',
            ],
            [
                'customer/detail',
            ]
        );
    }

    public function actionDocuments()
    {
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "customer/document"
            ],
            [
                "controllers/DocumentController",
                "controllers/UserController",
                "modulos/customer/document",
            ]
        );
    }
}