<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 14/06/2019
 * Time: 12:08
 */

class Template
{
    /**
     * @return stdClass
     */
    public static function defaultView(){
        $object = new stdClass();

        $object->view = [
            'menu/menuBase',
            'modal/modalCreateCustomer',
        ];
        $object->css = [
            'menu/menu',
            'menu/menu-close',
            'modal/modalCreateCustomer',
        ];
        $object->js = [
            "repositories/CentralRepository",
            "repositories/ConfigRepository",
            "modules/menu/menuBase",
            "modules/customer/addCustomer",
        ];

        return $object;
    }
}