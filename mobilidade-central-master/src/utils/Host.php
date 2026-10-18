<?php

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 16/02/2018
 * Time: 09:40
 */

class Host
{
    public static function getLocal()
    {
        return '/';
    }

    public static function getLogoCentral()
    {
        return '/webfiles/img/logo/';
    }

    public static function getCentral()
    {
        return '/webfiles/img/logo/';
    }

    public static function getVersion($file = null)
    {
        if ($file === null) {
            return '3.0.1.0';
        }

        $mtime = @filemtime(__DIR__ . '/../../public/webfiles/' . ltrim($file, '/'));

        return $mtime ? (string) $mtime : '3.0.1.0';
    }

}
