<?php

namespace Common\Utils;

class FormatValue
{

    public static function formatForReal($value)
    {
        return number_format($value, 2, ",", ".");
    }

    public static function formatPhoneClear($value)
    {
        if (empty($value))
            return null;

        $phone = str_replace('(', '', $value);
        $phone = str_replace('-', '', $phone);
        $phone = str_replace(')', '', $phone);
        $phone = str_replace(' ', '', $phone);
        $phone = str_replace('.', '', $phone);
        $phone = str_replace('+', '', $phone);

        return $phone;
    }

    public static function formatDocumentClear($document)
    {
        return str_replace([
            '-', '.', '/', '\\', ',', ' '
        ], '', $document);
    }

    public static function onlySimpleCharacters($value)
    {
        return str_replace([
            '-', '.', '/', '\\', ',', ' ', '+', '(', ')'
        ], '', $value);
    }


    public static function convertToFloat($valor): float
    {
        $valor = trim($valor);
        $source = array('.', ',');
        $replace = array('', '.');
        $valor = preg_replace("/\s+/", "", $valor);
        $valor = str_replace($source, $replace, $valor);
        $valor = str_replace('R$', '', $valor);
        return (float)$valor;
    }

    public static function convertToCents($valor)
    {
        return intval($valor * 100);
    }
}
