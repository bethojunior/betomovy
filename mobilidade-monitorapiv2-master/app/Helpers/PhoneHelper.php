<?php

namespace App\Helpers;

class PhoneHelper
{
    /**
     * Remove todos os caracteres que não são dígitos.
     *
     * @param string $phone
     * @return string
     */
    public static function normalizePhone(string $phone): string
    {
        return preg_replace('/\D/', '', $phone);
    }
}