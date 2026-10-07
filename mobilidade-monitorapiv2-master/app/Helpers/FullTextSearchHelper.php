<?php

namespace App\Helpers;

class FullTextSearchHelper
{
    /**
     * Monta o termo pra MATCH...AGAINST(...) IN BOOLEAN MODE (cada palavra vira prefixo +palavra*).
     *
     * @param string $term
     * @return string
     */
    public static function prepareBooleanQuery(string $term): string
    {
        $clean = preg_replace('/[+\-><()~*"@]/', ' ', $term);
        $words = array_filter(explode(' ', trim($clean)));

        return implode(' ', array_map(fn($word) => '+' . $word . '*', $words));
    }
}
