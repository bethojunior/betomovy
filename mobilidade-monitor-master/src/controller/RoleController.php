<?php


class RoleController extends View
{
    public function actionEdit()
    {
        $this->nameView = "Editar Regra";
        $this->setTemplate(Template::defaultView());
        $this->layoutBuilder(
            [
                "setting/profile/edit"
            ],
            [
                "controllers/RulesController",
                "modulos/setting/rules/edit"
            ]
        );
    }
}