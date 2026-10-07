<?php

namespace App\Services\Pulse;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Bus;

class PulseService
{
    private string $endpoint;
    private string $app;
    private string $groupId;
    private ?string $requestHeaderToken = null;

    private const VALID_TYPES = ['error', 'warn', 'info', 'debug', 'critical', 'emergency', 'alert', 'notice'];

    public function __construct(string $app, string $groupId, ?string $requestHeaderToken = null)
    {
        $this->endpoint = env('API_PULSE_URL', 'https://api-pulse.704app.com.br/logs');
        $this->app = $app;
        $this->groupId = $groupId;
        $this->requestHeaderToken = $requestHeaderToken;
    }

    public function handle(string $message, string $context, string $type): void
    {
        try {
            if (!in_array($type, self::VALID_TYPES, true)) $type = 'info';
            $payload = [
                'type'    => $type,
                'message' => $message,
                'app'     => $this->app,
                'context' => $context,
                'groupId' => $this->groupId,
            ];
            $requestHeaderToken = $this->requestHeaderToken;
            $endPoint = $this->endpoint;
            Bus::dispatch(function () use ($endPoint, $requestHeaderToken, $payload) {
                Http::withHeaders([
                    'Authorization' => $requestHeaderToken,
                    'Content-Type'  => 'application/json',
                ])->post($endPoint, $payload);
            });
        } catch (\Exception $e) {
            Log::error('Exception when dispatching WhatsApp message job. ' . $e->getMessage());
        }
    }
}
