<?php 
    class HotelariaController extends View{
 
        function actionSistemaParaHoteisEPousadas()
        { 
            $js = ['modulos/modalVideo'];
            $css = ['reset','navbar','vendor/materialize.min','assets','reset','hostel','menuMobile','footer','preload','modalVideo'];

            $views = ['preload/index','hostel/index','nav/navBarHotel','nav/navBarMobileHotel','import/footer','modalVideo/establishment','modalVideo/establishmentMobile'];

            $seo = new stdClass();
            $seo->description   = 'Sistema gratuito para hotéis e pousadas voltado para gestão de táxi em seu estabelecimento, oferecendo segurança e preço baixe para seus hóspedes. Acesse e conheça.';
            $seo->title         = 'Return | Sistema para hotéis | Sistema para pousadas | ';
            
            $this->layoutBuilder($views, $js, $css, $seo);
        }
    }