<?php


class LoadController extends View
{

    public function actionMotorcycle(){
        $this->nameView = "Listagem de tipo de cargas para moto";
        $this->layoutBuilder(
            [
                "menu/index",
                "load/motorcycle"
            ],
            [
                "controllers/MonitorController",
                "controllers/DriverController",
                "modulos/menu/index",
                "modulos/load/motorcycle",
            ],
            [
                "menu/index",
                "load/motorcycle"
            ]
        );
    }

    public function actionTruckSmall(){
        $this->nameView = "Listagem de tipo de cargas para caminhões pequenos";
        $this->layoutBuilder(
            [
                "menu/index",
                "load/truck-small"
            ],
            [
                "controllers/MonitorController",
                "controllers/DriverController",
                "modulos/menu/index",
                "modulos/home/index",
                "modulos/driver/marketing",
            ],
            [
                "menu/index",
                "load/truck-small"
            ]
        );
    }


    public function actionTruckHigh(){
        $this->nameView = "Listagem de tipo de cargas para caminhões Grandes";
        $this->layoutBuilder(
            [
                "menu/index",
                "load/truck-small"
            ],
            [
                "controllers/MonitorController",
                "controllers/DriverController",
                "modulos/menu/index",
                "modulos/home/index",
                "modulos/driver/marketing",
            ],
            [
                "menu/index",
                "load/truck-small"
            ]
        );
    }

}