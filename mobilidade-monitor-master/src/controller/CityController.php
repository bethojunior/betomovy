<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 12/04/2019
 * Time: 08:47
 */

class CityController extends View
{
    public function actionAdd()
    {
        $this->layoutBuilder(
            [
                "menu/index",
                "city/add",
            ],
            [
                'service/MapService',
                "controllers/CountryController",
                "controllers/EstateController",
                "controllers/PriceController",
                "controllers/CityAreaController",
                "controllers/TripTypeController",
                "modulos/menu/index",
                "modulos/city/add",
            ],
            [
                "menu/index",
                "city/add",
            ]);
    }

    public function actionEditArea()
    {
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "city/editArea",
            ],
            [
                'service/MapService',
                "controllers/CityAreaController",
                "modulos/city/editArea",
            ],
            [
                "city/editArea",
            ]);
    }
}