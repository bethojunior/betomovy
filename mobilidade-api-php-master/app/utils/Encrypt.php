<?php

namespace app\utils;

class Encrypt
{
    public static function encrypt(string $value, string $passphrase = null): string
    {
        $method     = 'aes-256-cbc';
        $iv         = substr(bin2hex(openssl_random_pseudo_bytes(openssl_cipher_iv_length($method))), 0, 16);
        $encrypted  = openssl_encrypt($value, $method, $passphrase, 1, $iv);
        return $iv . ':' . bin2hex($encrypted);
    }
}