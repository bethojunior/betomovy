<?php
    class PrivacidadeController extends View{

    function actionIndex()
    {
        $css = ['reset','navbar','vendor/materialize.min','assets','privacy'];

        $views = ['politics/index'];

        $js = [];

        $seo = new stdClass();
        $seo->description = 'Aplicativo gratuito para Mobilidade Urbana, único app preocupado com o Meio Ambiente e oferecendo segurança e preço baixo para seus usuário. Baixe e conheça.';
        $seo->title = '';

        $this->titleGlobal = "Política de privacidade";

        $this->layoutBuilder($views, $js, $css, $seo);
    }
}