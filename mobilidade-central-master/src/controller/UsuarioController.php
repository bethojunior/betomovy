<?php

/**
 * Created by Betho Junior
 * User: Fabrica704_Acer
 * Date: 16/09/2025
 * Time: 10:08
 */

class UsuarioController extends View
{
    public function actionCadastro()
    {
        $this->layoutBuilder(
            [
                'customer/new'
            ],
            [
                'user/register',
                'repositories/UserRepository',
                'modules/user/register'
            ],
            [
                'user/register',
            ],
        );
    }

    public function actionRegister()
    {
        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                'user/register'
            ],
            [
                'modules/user/register'
            ]
        );
    }

}
