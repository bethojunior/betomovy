<?php
/**
 * Created by PhpStorm.
 * User: Betho
 * Date: 22/02/2019
 * Time: 10:40
 */

class TripController extends View
{
    public function actionAnalysis(){
        $this->nameView = "Listagem de corrida em analise";
        $this->layoutBuilder(
            [
                "menu/index",
                "trip/analysis"
            ],
            [
                "service/MapService",
                "controllers/TripController",
                "controllers/GoogleServiceController",
                "modulos/menu/index",
                "modulos/trip/analysis",
            ],
            [
                "menu/index",
                "trip/list",
                "trip/analysis"
            ]
        );
    }

    public function actionList(){
        $this->nameView = "Listagem de corrida";
        $this->layoutBuilder(
            [
                "menu/index",
                "trip/list",
            ],
            [
                "service/MapService",
                "controllers/CustomerController",
                "controllers/DriverController",
                "controllers/TripController",
                "controllers/GoogleServiceController",
                "modulos/menu/index",
                "modulos/trip/list",
            ],
            [
                "menu/index",
                "trip/list",
            ]
        );
    }

    public function actionGet(){
        return $this->addEvents([
            'details' => 'details',
            'rideDetails' => 'rideDetails',
        ]);
    }

    public function details(){
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'trip/details',
                'modal/modalDetailsMap',
                'modal/modalChatTrip',
            ],
            [
                'controllers/TripController',
                'controllers/Cliente/ClienteController',
                'controllers/GoogleServiceController',
                'service/MapService',
                'modulos/trip/details'
            ],
            [
                'trip/details'
            ]
        );
    }

    public function rideDetails(){
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'trip/rideDetails',
                'trip/list',
                'modal/modalDetailsMap',
                'modal/modalChatTrip',
            ],
            [
                'controllers/TripController',
                'controllers/Cliente/ClienteController',
                'controllers/GoogleServiceController',
                'service/MapService',
                'modulos/trip/rideDetails',
            ],
            [
                'trip/rideDetails'
            ]
        );
    }

}