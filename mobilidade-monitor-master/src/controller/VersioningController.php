<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 12/04/2019
 * Time: 08:47
 */

class VersioningController extends View
{
    public function actionAdd()
    {
        $this->layoutBuilder(
            [
                "menu/index",
                "versioning/version",
            ],
            [
                'service/MapService',
                "controllers/EstateController",
                "controllers/PriceController",
                "modulos/menu/index",
                "modulos/versioning/version",
            ],
            [
                "menu/index",
                "versioning/version",
            ]);
    }

    public function actionApplications()
    {
        $this->nameView = "Versões das aplicações";
        $this->layoutBuilder(
            [
                "menu/index",
                "versioning/applications",
            ],
            [
                "modulos/menu/index",
                "modulos/versioning/applications",
            ],
            [
                "menu/index",
                "cliente/init"
            ]);
    }
}