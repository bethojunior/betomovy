<?php

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 16/02/2018
 * Time: 09:40
 */

class Host
{
    const HOME = "home";
    const NAME_APPLICATION = "Fabrica 310";

    public static function getLocal()
    {
        $url = explode(':', $_SERVER['HTTP_HOST'])[0];
        return '/';
    }

    public static function getImageAdmin()
    {
        return getenv('PATH_IMAGE_ADMIN');
    }

    public static function getVersion()
    {
        if (file_exists(PROJECT_PUBLIC_DIR . "/version")) {
            return file_get_contents(PROJECT_PUBLIC_DIR . "/version");
        }

        $version = rand(100000, 999999);
        file_put_contents(PROJECT_PUBLIC_DIR . "/version", $version);
        return $version;
    }
}
