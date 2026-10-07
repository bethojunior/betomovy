<?php


class TipsController extends View
{
    public function actionIndex()
    {
        $this->nameView = "Dicas";

        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "tips/index"
            ],
            [
                "controllers/ReportController",
                "modulos/tips/index"
            ],
            [
                "tips/index",
                ""
            ]);
    }


}