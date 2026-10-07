<?php

    class ClienteController extends View{

    function actionClient()
    {
        $js = ['modulos/modalVideo'];
        $css = ['reset','navbar','vendor/materialize.min','assets','reset','customers','menuMobile','footer','preload','modalVideo'];

        $views = ['preload/index','nav/navBar','nav/navBarMobile','customers/index','import/footer'];

        $seo = new stdClass();
        $seo->description = 'Aplicativo gratuito para Mobilidade Urbana.';
        $seo->title = Host::getApplicationName().' | Aplicativo de Mobilidade Urbana |';

        $this->layoutBuilder($views, $js, $css, $seo);
    }

    function actionPreRegister(){
        $this->titleGlobal = "Cadastre-se";

        $js = ['controllers/ClienteController', 'controllers/CityController','modulos/cliente/init', 'controllers/HomeController'];
        $css = ['cliente/preRegister'];

        $views = ['client/preRegister'];

        $seo = new stdClass();
        $seo->description = 'Pre cadastro Cliente';
        $seo->title = Host::getApplicationName().' | Aplicativo de Mobilidade Urbana |';

        $this->layoutBuilder($views, $js, $css, $seo);
    }
}