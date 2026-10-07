<?php

namespace app\utils;

use app\model\Config;

/**
 * Normaliza número de telefone pra envio (SMS/WhatsApp), com DDI.
 *
 * Histórico: antes desse cadastro suportar DDI, todo número salvo era
 * brasileiro sem código de país (10 ou 11 dígitos). Hoje o cadastro já manda
 * o número completo com DDI (12+ dígitos, ex: 55 11 999998888). As duas
 * formas convivem na base, então a normalização decide qual é qual pelo
 * tamanho — não dá pra distinguir de outro jeito sem coluna nova.
 */
class PhoneNumberNormalizer
{
    private const LEGACY_BR_MAX_DIGITS = 11;

    public static function toDialable(?string $rawNumber): string
    {
        if (empty($rawNumber)) {
            return '';
        }

        $digits = FormatValue::formatPhoneClear($rawNumber);

        if (strlen($digits) > self::LEGACY_BR_MAX_DIGITS) {
            return $digits;
        }

        return Config::get('code_phone_country') . self::fixLegacyBrDigit($digits);
    }

    private static function fixLegacyBrDigit(string $digits): string
    {
        if (strlen($digits) !== 10) {
            return $digits;
        }

        $ddd = substr($digits, 0, 2);
        $number = substr($digits, 2);

        if (substr($number, 0, 1) !== '9') {
            $number = '9' . $number;
        }

        return $ddd . $number;
    }
}
