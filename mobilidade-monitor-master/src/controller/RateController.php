<?php


class RateController extends View
{
    public function actionIndex()
    {
        $this->nameView = "Configurações de taxas adcionais";
        $this->layoutBuilder(
            [

                "menu/index",
                "rate/index",
            ],
            [
                "controllers/PriceController",
                "controllers/AdminController",
                "controllers/DriverController",
                "controllers/TripTypeController",
                "modulos/menu/index",
                "modulos/setting/app",
            ],
            [
                "menu/index",
                "rate/index"
            ]
        );
    }

}