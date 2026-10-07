<?php

namespace app\utils;

use app\model\Config;
use app\utils\Pulse\PulseService;

class TripRealtimeApiClient
{
    protected string $baseUrl;
    protected int $timeout;
    protected PulseService $pulse;

    public function __construct()
    {
        $this->timeout = 60 * 1000; // Default timeout in milliseconds
        $this->baseUrl = env('API_SOCKET_URL');

        $pulseApp =  'api-php-' . Config::get('app_title');

        $this->pulse = new PulseService($pulseApp, env('PULSE_GROUP_ID'));
    }

    public function postTripEvent(array $payload): array
    {
        try {
            $url = $this->baseUrl . "/webhook/trip";
            $json = json_encode($payload);

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_TIMEOUT_MS => $this->timeout,
                CURLOPT_CONNECTTIMEOUT_MS => $this->timeout,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $json,
                CURLOPT_HTTPHEADER => array_merge([
                    'Content-Type: application/json',
                    'Content-Length: ' . strlen($json)
                ]),
            ]);

            $body = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            if ($error || $status < 200 || $status >= 300) {
                $message = "Erro ao enviar webhook trip: {$error} (status {$status})";
                $this->pulse->handle($message, static::class, 'critical');
            } 

            return ['status' => $status, 'response' => $body, 'error' => $error];
        } catch (\Throwable $e) {
            $message = "Exceção ao enviar webhook trip: {$e->getMessage()}";
            $this->pulse->handle($message, static::class, 'critical');
            return ['status' => 0, 'response' => null, 'error' => $e->getMessage()];
        }
    }
}
