<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 21/06/2019
 * Time: 17:59
 */

class RadiusController extends View
{
    public function actionIndex()
    {
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'radius/index'
            ],
            [
                "repositories/CentralRepository",
                'modules/radius/index'
            ]);
    }
}