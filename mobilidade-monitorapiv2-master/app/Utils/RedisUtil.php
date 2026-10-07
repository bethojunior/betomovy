<?php

namespace App\Utils;

use GuzzleHttp\Client;
use Exception;

class RedisUtil
{
    private $client;
    private $apiUrl;

    public function __construct()
    {
        $this->client = new Client();
        $this->apiUrl = 'https://mobilidade-api-php-'. env('APP_NAME'). "." . ( env('ENV') === 'production' ? env('DOMAIN', "prod") : 'dev'). '.704apps.com.br/';
    }

    public function set($key, $value, int $ttl = 3600): void
    {
        $endpoint = $this->apiUrl . 'cache/set';

        try {
            $this->client->request('POST', $endpoint, [
                'json' => [
                    'key' => $key,
                    'value' => $value,
                    'ttl' => $ttl
                ],
            ]);
        } catch (Exception $exception) {
        }
    }

    public function get($key)
    {
        $endpoint = $this->apiUrl . 'cache/get';
        try {
            $response = $this->client->request('POST', $endpoint, [
                'json' => [
                    'stdObject' => [
                        ['key' => $key]
                    ]
                ],
            ]);
            return json_decode($response->getBody()->getContents(), true);
        } catch (Exception $exception) {
            return null;
        }
    }

    public function delete($key): void
    {
        $endpoint = $this->apiUrl . 'cache/delete';

        try {
            $this->client->request('POST', $endpoint, [
                'json' => [
                    'stdObject' => [
                        ['key' => $key]
                    ]
                ],
            ]);
        } catch (Exception $exception) {
        }
    }
}
