<?php

class NeighborhoodRidesController extends View
{
    public function actionList(){
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "preload/index",
                "neighborhoodRides/list"
            ],
            [
                "service/MapService",
                "controllers/NeighborhoodController",
                "modules/neighborhoodRides/list",
            ],
            [
                "preload/index",
                "neighborhoodRides/list"
            ]
        );
    }
}