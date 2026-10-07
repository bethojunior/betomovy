<?php

namespace app\utils;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/11/2018
 * Time: 12:27
 */
class TokenApi
{
    public function generate($key = null)
    {
        $firstRule = strtotime(date('Y-m-d H:i:s'));
        $secondRule = $key ?? '';

        return base64_encode($firstRule . $secondRule);
    }

    public function encrypt($token)
    {
        return password_hash($token, PASSWORD_BCRYPT);
    }
}