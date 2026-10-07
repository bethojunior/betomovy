<?php


class CarController extends View
{
    public function actionPending()
    {
        $this->nameView="Carros Pendentes";
        $views = ["car/pending"];
        $js = [
            "controllers/CarController",
            "modulos/car/pending"
        ];
        $css = ["car/pending"];
        $this->setTemplate(Template::defaultView());
        return $this->layoutBuilder($views, $js, $css);
    }
}