<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 19/06/2019
 * Time: 10:10
 */

class ManagerController extends View
{

    public function actionSignUp()
    {
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                'manager/signup'
            ],
            [
                'controllers/ManagerController',
                'modulos/manager/add',
            ]);
    }

    public function actionIndex(){
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                'manager/list'
            ],
            [
                'controllers/ManagerController',
                'modulos/manager/list',
            ],
            [
                'manager/list'
            ]
        );
    }

    public function actionDrivers(){
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                'manager/listDrivers'
            ],
            [
                'controllers/ManagerController',
                'modulos/manager/drivers',
            ]
        );
    }
}