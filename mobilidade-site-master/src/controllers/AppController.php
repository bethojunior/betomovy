<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 08/01/2019
 * Time: 19:44
 */

class AppController extends View
{
    public function actionShare(){

        $this->layoutBuilder([

        ],[
            "controllers/AppSharingController",
            "modulos/app/share"
        ],[

        ]);
    }

    public function actionCreateCardToken()
    {
        $this->layoutBuilder([
            "card/createCardToken"
        ]);
    }
}