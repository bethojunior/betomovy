<?php
class HomeController extends View{

    function actionIndex()
    {

        $js  = [
            'modulos/home/index',
            'controllers/HomeController'
        ];
        $css = ['home/index'];
        $views = ['home/main'];

        $seo = new stdClass();
        $seo->description   = 'O real app de mobilidade urbana';
        $seo->title         = Host::getApplicationName().' - Aplicativo de Mobilidade Urbana';

        $this->layoutBuilder($views, $js, $css, $seo);
    }
}