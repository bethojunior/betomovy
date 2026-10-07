<?php

namespace app\utils;

class Ip
{
    public static function server(): string
    {
        // if storage/cache/server.ip exists return it
        // else get server ip and save it to storage/cache/server.ip
        // return server ip
        if (file_exists('storage/cache/server.ip')) {
            return file_get_contents('storage/cache/server.ip');
        } else {
            $serverIp = self::getServerIp();
            file_put_contents('storage/cache/server.ip', $serverIp);
            return $serverIp;
        }
    }

    private static function getServerIp(): string
    {
        $external_ip = exec('curl https://ipecho.net/plain; echo');

        if (filter_var($external_ip, FILTER_VALIDATE_IP)) {
            return $external_ip;
        }

        $external_ip = exec('curl https://api.ipify.org; echo');

        if (filter_var($external_ip, FILTER_VALIDATE_IP)) {
            return $external_ip;
        }

        $external_ip = exec('curl https://ifconfig.me; echo');

        if (filter_var($external_ip, FILTER_VALIDATE_IP)) {
            return $external_ip;
        }

        return $_SERVER['SERVER_ADDR'];
    }
}