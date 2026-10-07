<?php
/**
 * Created by PhpStorm.
 * User: Betho
 * Date: 27/12/2018
 * Time: 11:36
 */

class PlusController extends View
{
    function actionPreRegister(){

        $js = ['modulos/plusRegister' , 'controllers/PlusController'];
        $css = ['plus/preRegister'];

        $views = ['preload/index','plus/preRegister'];

        $seo = new stdClass();
        $seo->description = 'Aplicativo gratuito para Mobilidade Urbana. Único app preocupado com o Meio Ambiente e oferecendo segurança e preço baixo para seus usuário. Baixe e conheça.';
        $seo->title = Host::getApplicationName().'| Pré-cadastro motorista parceiro ';

        $this->layoutBuilder($views, $js, $css, $seo);
    }

    function actionPlus()
    {
        $js = ['modulos/modalVideo'];
        $css = ['reset','navbar','navbar','vendor/materialize.min','assets','plus','menuMobile','footer','preload','modalVideo'];

        $views = ['preload/index','nav/navBar','nav/navBarMobile','plus/index','import/footer'];

        $seo = new stdClass();
        $seo->description = 'Aplicativo gratuito para Mobilidade Urbana.';
        $seo->title = 'Plus Return | Pré-cadastro motorista parceiro ';

        $this->layoutBuilder($views, $js, $css, $seo);
    }

}