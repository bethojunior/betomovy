<?php

namespace app\utils;
/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 27/06/2018
 * Time: 10:29
 */
class Key
{
    const FILE = "synchronizeKey.ini";

    private static function generateSynchronizeKey()
    {
        $key = date('Y-m-d H:i:s');
        $key = str_replace('-', '', $key);
        $key = str_replace(':', '', $key);
        return str_replace(' ', '', $key);
    }

    public static function updateSynchronizeKey()
    {
        $result = fopen("../key/" . self::FILE, "w+");

        fwrite($result, "key = " . self::generateSynchronizeKey());

        fclose($result);

        return self::getSynchronizeKey();
    }

    public static function getSynchronizeKey()
    {
        return parse_ini_file("../key/" . self::FILE)['key'];
    }
}