<?php

class DynamicFieldsController extends View
{  

    public function actionList(){

        $this->setTemplate(Template::defaultView());

        return $this->layoutBuilder(
            [
                'dynamicfields/list',
                'preload/index',
            ],
            [
                'controllers/DynamicFieldsController',
                'modules/dynamicfields/list',
            ],
            [
                'preload/index',
                'dynamicfields/list',
            ]);
    }
}