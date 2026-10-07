<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 02/01/2019
 * Time: 16:06
 */

class TripController extends View
{
    public function actionGet()
    {
        return $this->addEvents([
            'share' => 'share'
        ]);
    }

    public function share()
    {
        $this->layoutBuilder(
            [
                'trip/share'
            ],
            [
                'realtime/TripRealtime',
                'realtime/TripRouteRealtime',
                'controllers/TripController',
                'controllers/CityController',
                'service/MapService',
                'modulos/trip/share',
                'controllers/HomeController',
                'utils/init',
                'utils/Popup',
            ],
            [
                'trip/share',
                'maps/Popup'
            ]);
    }
}