<?php

class KeysController extends View
{
    public function actionList(){
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'keys/list'
            ],
            [
                'repositories/KeyRepository',
                'modules/keys/index'
            ],
            [
                'keys/keys'
            ]
        );
    }
}