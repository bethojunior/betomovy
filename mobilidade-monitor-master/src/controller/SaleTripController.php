<?php 

class SaleTripController extends View 
{
    public function actionList()
    {
        $this->nameView = "Listar Promoções";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                'sale/list',
            ],
            [
                'controllers/SaleTripController',
                'controllers/EstateController',
                'modulos/sale/sale',
            ]
        );
    }
}