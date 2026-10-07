<?php


class NotifyController extends View
{

    public function actionIndex()
    {
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "notify/index"
            ],
            [
                "controllers/UserTypeController",
                "modulos/notify/index"
            ],
            [
                "notification/index"
            ]);
    }

    public function actionNotifyBirthday()
    {
        $this->nameView = "Notificação de aniversário";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "notify/notifyBirthday"
            ],
            [
                "controllers/UserTypeController",
                "modulos/notify/notifyBirthday"
            ]);
    }
}