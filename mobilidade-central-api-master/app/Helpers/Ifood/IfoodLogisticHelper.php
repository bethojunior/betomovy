<?php

namespace App\Helpers\Ifood;
use GuzzleHttp\Client;

class IfoodLogisticHelper
{
    public function getPrices($origin, $destination, $token, $userId, $keyAppPartner = null)
    {
        $url = env('MOBILIDADE_URL') . "PricePartner/Calculate";
        $body = [
            'origin' => [
                'latitude' => $origin['latitude'],
                'longitude' => $origin['longitude'],
            ],
            'destination' => [
                'latitude' => $destination['latitude'],
                'longitude' => $destination['longitude'],
            ],
            'isCalledCentral' => true,
            'onlyCentral' => true,
            'isCentral' => 1
        ];

        if (!is_null($keyAppPartner)) {
            $body['keyAppPartner'] = $keyAppPartner;
        }

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
