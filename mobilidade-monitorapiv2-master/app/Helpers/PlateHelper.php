<?php

namespace App\Helpers;

class PlateHelper
{
    /**
     * Normaliza uma placa removendo espaços, hífens e convertendo para maiúsculas.
     *
     * @param string $plate
     * @return string
     */
    public static function normalizePlate(string $plate): string
    {
        return strtoupper(preg_replace('/[\s-]/', '', $plate));
    }
}