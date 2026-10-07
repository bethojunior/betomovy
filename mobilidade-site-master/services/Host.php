<?php
class Host
{
    const HOME = "home";
    const PWA  = "https://pwa.taxireturn.com.br/";
    const NAME_APPLICATION = 'Demo';
    const BUCKET = 'taxireturnteste';
    const pathImageDefault = 'https://s3-sa-east-1.amazonaws.com/' . self::BUCKET . '/default.jpg';
    const LINK_APP_CLIENT = ''; //'https://play.google.com/store/apps/details?id=br.com.fabrica704.elshaday.client';
    const lINK_APP_DRIVERS = ''; //'https://play.google.com/store/apps/details?id=br.com.fabrica704.elshaday.driver';
    const lINK_APP_CLIENTE_IOS = ''; //'https://itunes.apple.com/br/app/return-cliente/id1452297278?mt=8';

    public static function getLocal()
    {
        return '/';
    }

    public static function getHostPwa()
    {
        return env("pwa");
    }

    public static function getApplicationName(): string
    {
        return getenv('CUSTOMER_NAME') ?: self::NAME_APPLICATION;
    }

    public static function getPathImageDefault(): string
    {
        $baseUrl = rtrim((string) (getenv('STORAGE_BASE_URL') ?: 'https://minio.704app.com.br'), '/');
        $bucket = getenv('BUCKET_NAME') ?: self::BUCKET;
        return $baseUrl . '/' . $bucket . '/default.jpg';
    }

    public static function getLinkAppClient(): string
    {
        return getenv('LINK_APP_CLIENT') ?: self::LINK_APP_CLIENT;
    }

    public static function getLinkAppDrivers(): string
    {
        return getenv('LINK_APP_DRIVERS') ?: self::lINK_APP_DRIVERS;
    }

    public static function getLinkAppClienteIos(): string
    {
        return getenv('LINK_APP_CLIENTE_IOS') ?: self::lINK_APP_CLIENTE_IOS;
    }
}
