<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 10/07/2018
 * Time: 09:01
 */

class DefaultController extends View
{
    public function actionLogin()
    {
        $this->layoutBuilder
        (
            ['login/index'],
            [
                'modulos/login/index',
                'controllers/UserController',
                'controllers/MapSettingController',
                'controllers/ConfigAllController'
            ],
            ["login/index"]
        );
    }

    public function actionOffline(){
        $this->rendererView('offline/index');
    }

    public function actionLogout(){
        Session::delete('user');
        header('Location: /');
    }

}