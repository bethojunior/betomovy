<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 15:50
 */

namespace App\Utils;


class TokenApi
{
    public function generate($key = null)
    {
        $firstRule = strtotime(date('Y-m-d H:i:s'));
        $secondRule = $key ?? '';

        return base64_encode($firstRule.$secondRule);
    }

    public function encrypt($token)
    {
        return password_hash($token, PASSWORD_BCRYPT);
    }
}
