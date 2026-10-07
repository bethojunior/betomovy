<?php


class MilitaryForceGraduationController extends View
{
    public function actionList()
    {
        $this->nameView="Patentes Militares";
        $views = ["militaryForceGraduation/index"];
        $js = [
            "controllers/MilitaryForceGraduationController",
            "modulos/militaryForceGraduation/index"
        ];
        $css = ["military/militaryForceGraduation"];
        $this->setTemplate(Template::defaultView());
        return $this->layoutBuilder($views, $js, $css);
    }
}