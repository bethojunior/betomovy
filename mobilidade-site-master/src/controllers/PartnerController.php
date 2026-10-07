<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 03/05/2019
 * Time: 14:41
 */

class PartnerController extends View
{
    public function actionIndex()
    {
        $this->layoutBuilder(
            ['partner/requestPartnership'],
            [
                'controllers/PartnerController',
                'service/MapService',
                'modulos/partner/requestPartnership'
            ],
            ['partner/requestPartnership']);
    }
}