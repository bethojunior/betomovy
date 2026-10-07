<?php


class TermsUsePolicyController extends View
{
    public function actionList()
    {
        try {
            $this->nameView = "Termos de Uso";
            $this->layoutBuilder(
                [
                    "menu/index",
                    "terms-use-policy/index"
                ],
                [
                    "controllers/TermsUsePolicyController",
                    "modulos/menu/index",
                    "modulos/terms-use-policy/list",
                ],
                [
                    "menu/index",
                    "terms-use-policy/list"
                ]
            );
        } catch (Exception $exception) {
        }
    }
    
    public function actionEdit()
    {
        $this->nameView = 'Termos de política de uso';
        $this->layoutBuilder(
            [
                "menu/index",
                "terms-use-policy/edit",
            ],
            [
                "controllers/TermsUsePolicyController",
                "modulos/menu/index",
                "modulos/terms-use-policy/edit",
            ],
            [
                "menu/index",
                "terms-use-policy/edit"
            ]
        );
    }
}