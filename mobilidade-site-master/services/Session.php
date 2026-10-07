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
    public static function add($name, $value)
    {
        $_COOKIE[$name] = base64_encode(json_encode($value));
    }

    /**
     * @param $name
     * @return bool|mixed
     */
    public static function get($name)
    {
        if (!isset($_COOKIE[$name])) {
            return false;
        }

        if (Session::is_base64($_COOKIE[$name])) {
            return json_decode(utf8_encode(base64_decode($_COOKIE[$name])));
        } else {
            Session::delete($name);
            return false;
        }
    }

    /**
     * @param $name
     */
    public static function delete($name)
    {
        unset($_COOKIE[$name]);
        setcookie($name, '', time() - 3600, '/');
    }

    public static function is_base64($s)
    {
        // Check if there are valid base64 characters
        if (!preg_match('/^[a-zA-Z0-9\/\r\n+]*={0,2}$/', $s)) return false;

        // Decode the string in strict mode and check the results
        $decoded = base64_decode($s, true);
        if (false === $decoded) return false;

        // Encode the string again
        if (base64_encode($decoded) != $s) return false;

        return true;
    }
}