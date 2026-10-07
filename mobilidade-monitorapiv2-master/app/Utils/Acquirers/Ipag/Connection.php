<?php

namespace App\Utils\Acquirers\Ipag;

use Exception;

class Connection
{
    private $urlType;
    private $base_url;
    private $token;


    public function __construct(string $token, string $type = 'hml')
    {
        $this->urlType = $type;
        if ($this->urlType == 'hml') {
            $this->base_url = 'https://sandbox-api.rakim.com.br/';
        } else {
            $this->base_url = "https://api-expert.704pay.com.br/";
        }
        $this->token = $token;
    }

    public function post(string $endPoint = '/', array $data = [], $waitForResponse = true)
    {
        $headers[] = "Content-Type: application/json";
        $headers[] = "Authorization: Bearer " . $this->token;
    
        $data = json_encode($data);
    
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->base_url . $endPoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
        $response = curl_exec($ch);
        curl_close($ch);

        if (!$waitForResponse) {
            return null;
        }
    
        $decoded = json_decode($response);
        if (empty($decoded)) {
            throw new Exception('Connection Not Found');
        }
    
        return $decoded;
    }
    
}
