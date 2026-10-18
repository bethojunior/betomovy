<?php

namespace app\controllers;

use Exception;
use GuzzleHttp\Client;

class PublicityController extends ApiController
{
    /**
     * GET /publicity/advertising/customer
     */
    public function actionAdvertisingCustomer()
    {
        $this->actionAdvertising();
    }

    public function actionAdvertising()
    {
        try {
            $apiUrl = (getenv('ADMIN704APPS_API_URL') ?: '') . '/advertising/customer/' . (getenv('APP_NAME') ?: 'Movy');
            $id = getenv('ADMIN704APPS_API_ID') ?: '';
            $secret = getenv('ADMIN704APPS_API_SECRET') ?: '';

            if (empty($apiUrl) || empty($id)) {
                echo $this->returnSuccess('Publicidades', []);
                return;
            }

            $client = new Client(['timeout' => 3.0]);
            $response = $client->request('GET', $apiUrl, [
                'headers' => [
                    'id' => $id,
                    'secret' => $secret
                ]
            ]);

            $json = json_decode((string)$response->getBody(), true);
            echo $this->returnSuccess('Publicidades', $json['response'] ?? $json ?? []);
        } catch (Exception $e) {
            echo $this->returnSuccess('Publicidades', []);
        }
    }
}
