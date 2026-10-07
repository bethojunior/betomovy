<?php


class CompanyController extends View
{
    public function actionRegister()
    {
        $this->titleGlobal = "Cadastre-se";

        $this->layoutBuilder(
            [
                "corporate-route/register",
            ],
            [
                "controllers/CompanyController",
                "controllers/CityController",
                "modulos/company/register",
                "utils/ValidateForm"
            ],
            [
                "libs/bootstrap.min",
                "corporate-route/register"
            ]
        );
    }
}