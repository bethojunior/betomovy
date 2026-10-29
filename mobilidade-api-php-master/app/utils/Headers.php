<?php

namespace app\utils;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/12/2018
 * Time: 17:10
 */
class Headers
{
    private static function getHeaderCaseInsensitive(string $key)
    {
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        if (!empty($headers)) {
            $lowerKey = strtolower($key);
            foreach ($headers as $k => $v) {
                if (strtolower((string)$k) === $lowerKey && $v !== null && $v !== '') {
                    return $v;
                }
            }
        }

        // Fallback para $_SERVER (ex: HTTP_USERID, HTTP_TOKEN, HTTP_PLATFORM)
        $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $key));
        if (isset($_SERVER[$serverKey]) && $_SERVER[$serverKey] !== '') {
            return $_SERVER[$serverKey];
        }

        return null;
    }

    /**
     * Retornar o userid que vem nos headers para autorização
     * @return int|null
     */
    public static function getUserId()
    {
        return self::getHeaderCaseInsensitive('userid');
    }

    public static function getTripReference()
    {
        return self::getHeaderCaseInsensitive('tripreference');
    }

    /**
     * Retornar a plataforma que o usuário está fazendo a requisição
     * Esse parâmetro deve estar contido nos headers
     * @return string|null
     */
    public static function getPlatform()
    {
        return self::getHeaderCaseInsensitive('platform');
    }

    /**
     * Retorna a versão do aplicativo do usuário
     * que está fazendo a requisição
     * @return string|null
     */
    public static function getAppVersion()
    {
        return self::getHeaderCaseInsensitive('version');
    }

    /**
     * Retorna a chave para liberação de compra no cartão de crédito
     * através do mercado pago
     * @return string|null
     */
    public static function getMpToken()
    {
        return self::getHeaderCaseInsensitive('mptoken');
    }

    public static function getCentralId()
    {
        return self::getHeaderCaseInsensitive('centralId');
    }

    public static function getCentralRadius()
    {
        return self::getHeaderCaseInsensitive('placesSearchRadius');
    }

    public static function getCentralCustomEnabled()
    {
        return self::getHeaderCaseInsensitive('enableCustomRadiusCentral');
    }

    public static function getCityId()
    {
        return self::getHeaderCaseInsensitive('cityId');
    }
}
