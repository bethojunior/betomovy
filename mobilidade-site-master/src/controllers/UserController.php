<?php


class UserController extends View
{
    public function actionUpdateProfile()
    {
        return $this->layoutBuilder(
            [
                "user/updateProfile"
            ],
            [
                "modulos/user/updateProfile"
            ],
            [
                "user/updateProfile"
            ]
        );
    }
}