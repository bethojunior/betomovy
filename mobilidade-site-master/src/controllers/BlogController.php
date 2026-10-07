<?php
/**
 * Created by PhpStorm.
 * User: Betho
 * Date: 21/01/2019
 * Time: 15:11
 */

class BlogController extends View
{
    public function actionIndex(){
        $js    = ['utils/navBar','utils/navbarHomeMobile','modulos/blog/init'];
        $views = ['preload/index','blog/init'];
        $css   = ['vendor/materialize.min','assets','reset','preload','blog/init'];

        $seo = new stdClass();
        $seo->description   = 'As ultimas novidade da Return.';
        $seo->title         = 'Blog da Return';

        $this->layoutBuilder($views, $js, $css, $seo);
    }
}