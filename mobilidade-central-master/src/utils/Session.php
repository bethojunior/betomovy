<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 23/04/2019
 * Time: 15:51
 */

class Session
{
    /**
     * @param $name
     * @param $value
     */
    public static function add($name,$value)
    {
        $_COOKIE[$name] = base64_encode(json_encode($value));
    }

    /**
     * @param $name
     * @return bool|mixed
     */
    public static function get($name){
        if(!isset($_COOKIE[$name])){
            return false;
        }

        return json_decode( preg_replace('/[\x00-\x1F\x80-\xFF]/', '', base64_decode($_COOKIE[$name])));
    }

    /**
     * @param $name
     */
    public static function delete($name){
        unset($_COOKIE[$name]);
        setcookie($name, '', time() - 3600, '/');
    }
}