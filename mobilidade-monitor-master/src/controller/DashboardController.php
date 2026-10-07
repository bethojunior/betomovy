<?php


class DashboardController extends View
{

    public function actionBi()
    {
        $this->nameView = 'Power BI';

        $this->layoutBuilder
        (
            [
                "menu/index",
                "dashboard-bi/index"
            ],
            [
                "modulos/menu/index",
                "modulos/dashboard/bi/index"
            ],
            [
                "menu/index"
            ]
        );
    }
}
