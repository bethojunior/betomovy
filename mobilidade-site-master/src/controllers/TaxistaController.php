<?php

class TaxistaController extends View {

    public function actionAplicativoTaxistaEmFortaleza() {
        
        $js    = ['utils/PathUrl','modulos/modalVideo'];
        $css   = ['reset','navbar','vendor/materialize.min','driver','assets','menuMobile','footer','preload','modalVideo'];
        $views = ['preload/index','nav/navBar','nav/navBarMobile','driver/index','import/footer','modalVideo/driver','modalVideo/driverMobile'];

        $seo = new stdClass();
        $seo->description   = 'Aplicativo gratuito para Mobilidade Urbana.';
        $seo->title         = Host::getApplicationName().' | Aplicativo para motoristas';

        $this->layoutBuilder($views, $js, $css, $seo);
    }

}