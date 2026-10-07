<?php

namespace App\Utils\Acquirers\ZsPay;

use Exception;

class Connection
{
    private $urlType;
    private $base_url;
    private $token;


    public function __construct(string $token, string $type = 'homologation')
    {
        if (empty($token))
            throw new Exception('Token Invalid.');

        if ($type == 'production') {
            $this->urlType = false;
        } elseif ($type == 'homologation') {
            $this->urlType = true;
        } else {
            die('Type of invalid approval');
        }
        $this->token = $token;
        $protocol = (($this->urlType) ? 'http://' : 'https://');
        $this->base_url = $protocol . (($this->urlType) ? 'api-homologacao' : 'api');
    }

    public function get(string $url, array $headers = array())
    {
        $headers[] = "Accept: application/json";
        $headers[] = "Content-Type: application/json";
        $headers[] = "Authorization: Bearer " . $this->token;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->base_url . '.zsystems.com.br' . $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, FALSE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        curl_close($ch);
        $response = json_decode($response);
        if (empty($response))
            throw new Exception('Connection Not Found');
        return $response;
    }

    public function post(string $url = '/', array $params = [], array $headers = array())
    {
        $headers[] = "Accept: application/json";
        $headers[] = "Content-Type: application/json";
        $headers[] = "Authorization: Bearer " . $this->token;
        $params = json_encode($params);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->base_url . '.zsystems.com.br' . $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        curl_close($ch);
        $response = json_decode($response);
        if (empty($response))
            throw new Exception('Connection Not Found');
        return $response;
    }
}
