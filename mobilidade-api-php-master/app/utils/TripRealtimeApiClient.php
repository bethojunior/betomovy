<?php

namespace app\utils;

use app\model\Config;
use app\utils\Pulse\PulseService;

class TripRealtimeApiClient
{
    protected string $baseUrl = 'https://socket.movymob.com';
    protected int $timeout = 60000;
    protected ?PulseService $pulse = null;

    public function __construct()
    {
        $this->timeout = 60 * 1000; // Default timeout in milliseconds

        $envSocket = env('API_SOCKET_URL') ?: env('API_SOCKET_HOST');
        if (!empty($envSocket) && is_string($envSocket)) {
            $this->baseUrl = rtrim($envSocket, '/');
        } else {
            $this->baseUrl = 'https://socket.movymob.com';
        }

        try {
            $appTitle = Config::get('app_title');
            $pulseApp = 'api-php-' . (!empty($appTitle) ? $appTitle : 'movy');
            $groupId = env('PULSE_GROUP_ID') ?: 'movy';
            $this->pulse = new PulseService($pulseApp, $groupId);
        } catch (\Throwable $e) {
            $this->pulse = null;
        }
    }

    public function postTripEvent(array $payload): array
    {
        try {
            if (empty($this->baseUrl)) {
                return ['status' => 0, 'response' => null, 'error' => 'API_SOCKET_URL not configured'];
            }

            $url = $this->baseUrl . "/webhook/trip";
            $json = json_encode($payload);

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_TIMEOUT_MS => $this->timeout,
                CURLOPT_CONNECTTIMEOUT_MS => 5000,
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

            if (($error || $status < 200 || $status >= 300) && $this->pulse) {
                $message = "Erro ao enviar webhook trip: {$error} (status {$status})";
                $this->pulse->handle($message, static::class, 'critical');
            } 

            return ['status' => $status, 'response' => $body, 'error' => $error];
        } catch (\Throwable $e) {
            if ($this->pulse) {
                $message = "Exceção ao enviar webhook trip: {$e->getMessage()}";
                $this->pulse->handle($message, static::class, 'critical');
            }
            return ['status' => 0, 'response' => null, 'error' => $e->getMessage()];
        }
    }
}
