<?php

namespace app\utils;
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
        return env("host");
    }
}