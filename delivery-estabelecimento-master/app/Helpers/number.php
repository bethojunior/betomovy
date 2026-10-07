<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/06/2020
 * Time: 15:57
 */

/**
 * @param $number
 * @param string $lang
 */
//function formatMoney($number, $lang = 'pt-br') {
//    return "R$ " . number_format((float) $number, 2, ',', '.');
//}

/**
 * @param string $phone
 * @return string|string[]
 */
function clearFormatPhone(string $phone) {
    return str_replace(['(',')','-',' ','.','+'], '', $phone);
}
