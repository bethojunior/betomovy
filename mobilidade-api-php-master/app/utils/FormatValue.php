<?php

namespace app\utils;
/**
 * Created by Sublime Text.
 * User: Usuario
 * Date: 18/04/2018
 * Time: 15:54
 */
class FormatValue
{
    /**
     * @param $value
     * @return string
     */
    public static function formatForReal($value)
    {
        return number_format($value, 2, ",", ".");
    }


    /**
     * @param $value
     * @return mixed|null
     */
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

    public static function formatDocument($val, $mask)
    {
        $maskared = '';
        $k = 0;
        for ($i = 0; $i <= strlen($mask) - 1; ++$i) {
            if ($mask[$i] == '#') {
                if (isset($val[$k])) {
                    $maskared .= $val[$k++];
                }
            } else {
                if (isset($mask[$i])) {
                    $maskared .= $mask[$i];
                }
            }
        }

        return $maskared;
    }

    public static function convertToCents($valor)
    {
        return intval($valor * 100);
    }



    public static function brandsCard($number)
    {
        $brand = 'undefined';

        $brands = array(
            'mastercard' => '/^(5[1-5]\d{4}|677189)\d{10}$/',
            'discover'   => '/^6(?:011|5[0-9]{2})[0-9]{12}$/',
            'elo'        => '(4011|431274|438935|451416|457393|4576|457631|457632|504175|50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|627780|636297|636368|636369|(6503[1-3])|(6500(3[5-9]|4[0-9]|5[0-1]))|(6504(0[5-9]|1[0-9]|2[0-9]|3[0-9]))|(650(48[5-9]|49[0-9]|50[0-9]|51[1-9]|52[0-9]|53[0-7]))|(6505(4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-8]))|(6507(0[0-9]|1[0-8]))|(6507(2[0-7]))|(650(90[1-9]|91[0-9]|920))|(6516(5[2-9]|6[0-9]|7[0-9]))|(6550(0[0-9]|1[1-9]))|(6550(2[1-9]|3[0-9]|4[0-9]|5[0-8]))|(506(699|77[0-8]|7[1-6][0-9))|(509([0-9][0-9][0-9])))',
            'diners'     => '/^3(0[0-5]|[68]\d)\d{11}$/',
            'amex'       => '/^3[47]\d{13}$/',
            'jcb'        => '/^(?:2131|1800|35\d{3})\d{11}$/',
            'aura'       => '/^(5078\d{2})(\d{2})(\d{11})$/',
            'hipercard'  => '/^(606282\d{10}(\d{3})?)|(3841\d{15})$/',
            'maestro'    => '/^(?:5[0678]\d\d|6304|6390|67\d\d)\d{8,15}$/',
            'visa'       => '/^4\d{12}(\d{3})?$/',
        );
        foreach ( $brands as $_brand => $regex ) {
            if ( preg_match( $regex, $number ) ) {
                $brand = $_brand;
                break;
            }
        }

        return $brand;
    }


}