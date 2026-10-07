<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 26/06/2019
 * Time: 17:38
 */

class TripController extends View
{
    public function actionList(){
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "trip/list"
            ],
            [
                "repositories/DriverRepository",
                "modules/trip/list"
            ],
            [
                "trip/list"
            ]
        );
    }

    public function actionGet(){
         $this->addEvents(
            [
                'details' => 'details',
                "direction" => "direction"
            ]);
    }

    public function direction()
    {
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            ["trip/direction"],
            [
                "service/MapService",
                "controllers/TripController",
                "modules/trip/direction"
            ],
            ["trip/direction"]
        );
    }

    public function details(){
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "trip/details"
            ],
            [
                "service/MapService",
                "repositories/TripRepository",
                "modules/trip/details"
            ],
            [
                "trip/details"
            ]
        );
    }
}