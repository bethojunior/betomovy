<?php

namespace App\Realtimes\Clients;

use App\Providers\PulseProvider;
use App\Utils\Pulse\GroupIds;

abstract class AbstractRealtimeApiClient
{
    protected string $baseUrl;
    protected int $timeout;
    protected PulseProvider $pulse;

    abstract protected function getEndpoint(): string;
    abstract protected function getWebhookType(): string;

    public function __construct()
    {
        $this->timeout = 60 * 1000; // Default timeout in milliseconds
        $this->baseUrl = env('API_SOCKET_URL', '');

        $pulseApp =  'central-' . env('APP_NAME', 'laravel');

        $this->pulse = new PulseProvider($pulseApp, GroupIds::CENTRAL_PROD);
    }

    public function sendEvent(array $payload): array
    {
        try {
            $url = $this->baseUrl . $this->getEndpoint();
            $json = json_encode($payload);

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_TIMEOUT_MS => $this->timeout,
                CURLOPT_CONNECTTIMEOUT_MS => $this->timeout,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $json,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Content-Length: ' . strlen($json)
                ],
            ]);

            $body = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            if ($error || $status < 200 || $status >= 300) {
                $webhookType = $this->getWebhookType();
                $message = "Erro ao enviar webhook {$webhookType}: {$error} (status {$status})";
                $this->pulse->critical($message, static::class);
            }

            return ['status' => $status, 'response' => $body, 'error' => $error];
        } catch (\Throwable $e) {
            $webhookType = $this->getWebhookType();
            $message = "Exceção ao enviar webhook {$webhookType}: {$e->getMessage()}";
            $this->pulse->critical($message, static::class);
            return ['status' => 0, 'response' => null, 'error' => $e->getMessage()];
        }
    }
}