<?php

namespace app\utils;

use app\contracts\WhatsAppApiInterface;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/03/2020
 * Time: 10:38
 */
class ZapboxApi implements WhatsAppApiInterface
{
    /**
     * @var string $base_url
     */
    private $base_url;

    public function __construct($token = "rf64fe7", $access_key = "FDOJH893HU2")
    {
        $this->base_url = "https://api.whatsweb.app/send/{$token}/?token={$access_key}&cmd=chat";
    }

    public function sendText(string $numberTo, string $message)
    {
        $id = time();
        $numberTo = $this->formatNumber($numberTo);

        $message = urlencode($message);

        $url = $this->base_url . "&id={$id}&to={$numberTo}@c.us&msg={$message}";

        return $this->exec($url);
    }

    private function formatNumber(string $numberTo)
    {
        $number = str_replace(['+', ' ', '(', ')', '-', '.'], '', $numberTo);

        return strlen($number) <= 11 ? "55{$number}" : $number;
    }

    public function exec($url)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $url);

        $response = curl_exec($ch);

        curl_close($ch);
        return json_decode($response);
    }

    public function getExternalServiceId(): int
    {
        return 3;
    }
}