<?php

namespace App\Helpers;

class CnpjHelper
{
    /**
     * Valida o CNPJ
     *
     * @param string $cnpj
     * @return string
     */
    public static function validateCnpj(string $cnpj): string
    {
        return $cnpj = preg_replace('/\D/', '', $cnpj);
    }
}