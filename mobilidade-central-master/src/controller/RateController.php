<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 11/06/2019
 * Time: 18:45
 */

class RateController extends View
{

    public function actionAdd()
    {
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'rate/add'
            ],
            [
                'repositories/CentralRepository',
                'repositories/TripRepository',
                'modules/rate/add'
            ],
            [
                'rate/add-rate',
                'rate/rate',
            ]);
    }
}