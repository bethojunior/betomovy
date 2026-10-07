<?php

namespace app\utils;
use app\exceptions\UberException;

/**
 * Created by PhpStorm.
 * User: eduar
 * Date: 22/07/2018
 * Time: 18:56
 */
class UberApi
{
    const SERVER_TOKEN = "PAoWN2XnsX-mF-hvUpzISfVnRtrBBU7y2lMCMvvF";

    const URL = "https://api.uber.com/v1.2/estimates/price?";

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @return float|null
     * @throws UberException
     */
    public static function getPrice($start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        $response = json_decode(self::check($start_latitude, $start_longitude, $end_latitude, $end_longitude));

        if (!$response)
            throw new UberException(1500);

        if (!isset($response->prices))
            throw new UberException(1501, $response->message ?? null);

        return $response->prices[0]->low_estimate ?? null;
    }

    private static function check($start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        $ch = curl_init(self::getURL($start_latitude, $start_longitude, $end_latitude, $end_longitude));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Authorization: Token ' . self::SERVER_TOKEN,
                'Accept-Language: pt_BR',
                'Content-Type: application/json')
        );

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);

        curl_close($ch);
        return $response;
    }

    private static function getURL($start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        return self::URL . "start_latitude={$start_latitude}&start_longitude={$start_longitude}&end_latitude={$end_latitude}&end_longitude={$end_longitude}";
    }
}