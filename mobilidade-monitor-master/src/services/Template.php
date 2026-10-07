<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 11/06/2019
 * Time: 20:45
 */

class Template
{

    /**
     * @return stdClass
     */
    public static function defaultView()
    {
        $object = new stdClass();

        $object->view = [
            "menu/index",
        ];
        $object->css = [
            "menu/index",
        ];
        $object->js = [
            "modulos/menu/index",
        ];

        return $object;
    }
}