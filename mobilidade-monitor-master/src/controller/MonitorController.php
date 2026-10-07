<?php
/**
 * Created by PhpStorm.
 * User: Emerson
 * Date: 15/11/2018
 * Time: 22:11
 */

class MonitorController extends View
{
    public function actionMonitoring()
    {
        $this->layoutBuilder
        (
            [
                'monitor/index',
                'monitor/selectLocation',
                'monitor/optionTripActive',
                'modal/selectedCity',
                'modal/optionMonitor',
                'modal/followDriver',
                'driver/list',
                'customer/list',
                'notification/oneUser',
            ],
            [
                'service/MapService',
                'controllers/DriverController',
                'controllers/UserController',
                'controllers/MonitorController',
                'controllers/CustomerController',
                'controllers/NotificationController',
                'controllers/AdminAnaController',
                'controllers/TripController',
                'controllers/ChatController',
                'modulos/monitor/monitor',
                'modulos/driver/list',
                'modulos/customer/list',
                'modulos/monitor/selectCity',
                'modulos/monitor/optionTripActive',
                'modulos/notification/oneUser',
            ],
            [
                'monitor/monitor',
                'monitor/selectLocation',
                'monitor/optionTripActive',
                'modal/selectedCity',
                'modal/optionMonitor',
                'modal/followDriver',
                'driver/list',
                'customer/list',
                'notification/oneUser',
            ]
        );
    }

    public function actionIndex()
    {
        $this->nameView = "Inicio";
        $this->layoutBuilder
        (
            [
                "menu/index",
                "home/index"
            ],
            [
                "controllers/MonitorController",
                "controllers/DriverController",
                "modulos/menu/index",
                "modulos/home/index"
            ],
            [
                "menu/index",
                "home/index"
            ]
        );
    }

    public function actionDashboard()
    {
        $this->layoutBuilder
        (
            ['dashboard/index'],
            [
                'libs/chart/Chart',
                'libs/chart/Chart.min',
                'controllers/DashboardController',
                'modulos/dashboard/index'
            ],
            ["dashboard/index", "dashboard/fontawesome.min"]
        );
    }
}
