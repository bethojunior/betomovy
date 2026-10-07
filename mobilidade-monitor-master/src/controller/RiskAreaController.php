<?php

class RiskAreaController extends View
{
    public function actionIndex()
    {
        $this->nameView = "Área de risco";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder([
            "setting/riskArea"
        ],[
            "controllers/RiskAreaController",
            "service/MapService",
            "modulos/setting/riskArea"
        ]);
    }
}