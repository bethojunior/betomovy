<?php

namespace app\services;

use GuzzleHttp\Client;

class ListContactsService
{
    private Client $client;
    private string $baseUrl;
    private string $internalToken;

    public function __construct()
    {
        $this->client = new Client();
        $this->baseUrl = (string)(env('URL_MONITOR_APIV2') ?: '');
        $this->internalToken = (string)(ltrim((string)(env('INTERNAL_TOKEN') ?: ''), '^'));
    }

    public function insertContacts(string $endpoint, array $payload)
    {
        $response = $this->client->request('POST', $this->baseUrl . $endpoint, [
            'headers' => [
                'token' => $this->internalToken,
                'Content-Type' => 'application/json',
            ],
            'json' => $payload
        ]);

        return json_decode($response->getBody(), true);
    }
}
