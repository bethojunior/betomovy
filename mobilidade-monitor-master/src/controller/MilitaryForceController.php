<?php


class MilitaryForceController extends View
{
    public function actionList()
    {
        $this->nameView="Órgãos Militares";
        $views = ["militaryForce/index"];
        $js = [
            "controllers/MilitaryForceController",
            "modulos/militaryForce/index"
        ];
        $css = ["military/militaryForce"];
        $this->setTemplate(Template::defaultView());
        return $this->layoutBuilder($views, $js, $css);
    }
}