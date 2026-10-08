<?php

class LanguageController extends View
{
    public function actionManagement()
    {
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'language/management'
            ],
            [
                'modules/language/index'
            ]
        );
    }
}
