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
        $deployTimestamp = '4.2.0_' . time();
        if ($file === null) {
            return $deployTimestamp;
        }

        $mtime = @filemtime(__DIR__ . '/../../public/webfiles/' . ltrim($file, '/'));

        return ($mtime ? (string)$mtime : '1.0') . '_' . $deployTimestamp;
    }

}
