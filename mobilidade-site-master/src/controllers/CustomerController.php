<?php

class CustomerController extends View
{
    public function actionRequestDeleteData()
    {
        $this->titleGlobal = "Solicitação de exclusão de dados";
        $js = ["modulos/customer/requestDeleteData"];
        $views = ["customer/requestDeleteData"];
        $css = ["customer/requestDeleteData"];

        $this->layoutBuilder($views, $js, $css);
    }
}