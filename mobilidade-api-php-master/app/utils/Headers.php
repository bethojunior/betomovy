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
    /**
     * Retornar o userid que vem nos headers para autorização
     * @return int|null
     */
    public static function getUserId()
    {
        return (getallheaders()['userid'] ?? getallheaders()['Userid']) ?? null;
    }

    public static function getTripReference()
    {
        return (getallheaders()['tripreference'] ?? getallheaders()['Tripreference']) ?? null;
    }

    /**
     * Retornar a plataforma que o usuário está fazendo a requisição
     * Esse parâmetro deve estar contido nos headers
     * @return string|null
     */
    public static function getPlatform()
    {
        if (!isset(getallheaders()['platform']) && !isset(getallheaders()['Platform'])) {
            return null;
        }

        return (getallheaders()['platform'] ?? getallheaders()['Platform']) ?? null;
    }

    /**
     * Retorna a versão do aplicativo do usuário
     * que está fazendo a requisição
     * @return string|null
     */
    public static function getAppVersion()
    {
        return (getallheaders()['version'] ?? getallheaders()['Version']) ?? null;
    }

    /**
     * Retorna a chave para liberação de compra no cartão de crédito
     * através do mercado pago
     * @return string|null
     */
    public static function getMpToken()
    {
        return (getallheaders()['mptoken'] ?? getallheaders()['Mptoken']) ?? null;
    }

    public static function getCentralId()
    {
        return (getallheaders()['centralId'] ?? getallheaders()['centralid']) ?? null;
    }

    public static function getCentralRadius()
    {
        return (getallheaders()['placesSearchRadius'] ?? getallheaders()['placessearchradius'] ?? getallheaders()['Placessearchradius']) ?? null;
    }

    public static function getCentralCustomEnabled()
    {
        return (getallheaders()['enableCustomRadiusCentral'] ?? getallheaders()['enablecustomradiuscentral'] ?? getallheaders()['Enablecustomradiuscentral']) ?? null;
    }

    public static function getCityId()
    {
        return (getallheaders()['cityId'] ?? getallheaders()['CityId']) ?? null;
    }
}
