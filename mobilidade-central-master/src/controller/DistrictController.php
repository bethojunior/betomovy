<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 26/06/2019
 * Time: 17:38
 */

class DistrictController extends View
{
    public function actionList(){
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "preload/index",
                "district/list"
            ],
            [
                "service/MapService",
                "controllers/NeighborhoodController",
                "modules/district/list",
            ],
            [
                "preload/index",
                "district/list"
            ]
        );
    }
}