<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 18:43
 */

namespace App\Utils;


class UUID
{
    public static function v4()
    {
        $t = unpack('S8', openssl_random_pseudo_bytes(16));
        // four most significant bits of 3rd group hold version number 4
        $t[3] = $t[3] | 0x4000;
        // two most significant bits of 4th group hold zero and one for variant DCE1.1
        $t[4] = $t[4] | 0x8000;
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', ...$t);
    }
}
