<?php
/**
 * Created by PhpStorm.
 * User: Betho
 * Date: 26/02/2019
 * Time: 14:46
 */

class ContactController extends View
{
    public function actionList(){
        $this->nameView = "Fale conosco";
        $this->layoutBuilder(
            [
                "menu/index",
                "contact/list",

            ],
            [
                "controllers/MonitorController",
                "controllers/ContactController",
                "modulos/menu/index",
                "modulos/contact/list"
            ],
            [
                "menu/index",
                "contact/list"
            ]
        );
    }

    public function actionReport(){
        $this->nameView = "Report";
        $this->layoutBuilder(
            [
                "menu/index",
                "contact/report"
            ],
            [
                "controllers/ContactController",
                "modulos/menu/index",
                "modulos/contact/report",
            ],
            [
                "menu/index",
                "contact/report"
            ]
        );
    }

}