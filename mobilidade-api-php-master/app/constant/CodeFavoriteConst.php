<?php

namespace app\constant;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/05/2019
 * Time: 14:38
 */
class CodeFavoriteConst
{
    public static function makeCode($nickname, $idDriver, $userType)
    {
        $nickname = self::removeAccentuation($nickname);
        $name = str_split($nickname);

        $type =
            in_array(
                $userType,
                [UserType::MOTORISTA_RETURN, UserType::MOTORISTA_PARTICULAR]) ?
                "P" : "T";

        $code = "00000";
        $code = substr($code, 0, strlen($idDriver) * -1) . $idDriver;

        return strtoupper($name[0] . $name[count($name) - 1] . $code . $type);
    }

    private static function removeAccentuation($string)
    {
        $comAcentos =
            array(
                'à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ',
                'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ü', 'ú', 'ÿ', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å',
                'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'O', 'Ù', 'Ü', 'Ú');

        $semAcentos =
            array(
                'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n',
                'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'y', 'A', 'A', 'A', 'A', 'A', 'A',
                'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'N', 'O', 'O', 'O', 'O', 'O', '0', 'U', 'U', 'U');

        return str_replace($comAcentos, $semAcentos, $string);
    }
}