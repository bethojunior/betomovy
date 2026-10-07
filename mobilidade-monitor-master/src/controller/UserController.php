<?php


class UserController extends View
{

    public function actionDriver()
    {
        $this->nameView = "Inserir usuário motorista";
        $this->layoutBuilder(
            [
                "menu/index",
                "user/driver"
            ],
            [
                "controllers/UserController",
                "modulos/menu/index",
                "modulos/user/driver",
            ],
            [
                "menu/index",
                "user/driver"
            ]
        );
    }

}