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
        $encoded = base64_encode(json_encode($value));
        $_COOKIE[$name] = $encoded;
        if (!headers_sent()) {
            setcookie($name, $encoded, time() + (86400 * 30), '/');
        }
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

        $raw = $_COOKIE[$name];
        $decoded = base64_decode($raw, true);
        if ($decoded === false) {
            $decoded = $raw;
        }

        $obj = json_decode($decoded);
        if ($obj !== null) {
            return $obj;
        }

        // Fallback for edge cases
        $stripped = preg_replace('/[\x00-\x1F]/', '', $decoded);
        $obj = json_decode($stripped);
        if ($obj !== null) {
            return $obj;
        }

        return false;
    }

    /**
     * @param $name
     */
    public static function delete($name)
    {
        unset($_COOKIE[$name]);
        if (!headers_sent()) {
            setcookie($name, '', time() - 3600, '/');
        }
    }
}