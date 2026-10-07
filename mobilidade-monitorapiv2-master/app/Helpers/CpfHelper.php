<?php

namespace App\Helpers;

class CpfHelper
{
    /**
    * Formata o CPF para o padrão xxx.xxx.xxx-xx.
     * @param string $cpf
     * @return string
     */
    public static function maskCpf(string $cpf): string
    {
        // Remove qualquer caractere que não seja dígito.
        $cpf = preg_replace('/\D/', '', $cpf);
    
        // Verifica se possui 11 dígitos.
        if (strlen($cpf) !== 11) {
            return $cpf;
        }
    
        return substr($cpf, 0, 3) . '.' .
               substr($cpf, 3, 3) . '.' .
               substr($cpf, 6, 3) . '-' .
               substr($cpf, 9, 2);
    } 
}