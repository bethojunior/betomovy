<?php

namespace App\Helpers\Ifood;

use GuzzleHttp\Client;

class IfoodHelper
{
    public function getPrices($origin, $destination, $token, $userId)
    {
        $url = env('MOBILIDADE_URL') . "PricePartner/Calculate";
        $body = [
            'origin' => [
                'latitude' => $origin['latitude'],
                'longitude' => $origin['longitude'],
            ],
            'destination' => [
                'latitude' => $destination['latitude'] == 0 ? -3.7387879 : $destination['latitude'],
                'longitude' => $destination['longitude'] == 0 ? -38.5874347 : $destination['longitude'],
            ],
        ];
        $clientRequest = new Client();
        $response = $clientRequest->post($url, [
            'json' => $body,
            'headers' => [
                'userId' => $userId,
                'token' => $token
            ],
        ]);
        return json_decode($response->getBody()->getContents());
    }
}
