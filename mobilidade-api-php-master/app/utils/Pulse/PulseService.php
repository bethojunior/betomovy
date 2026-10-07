<?php

namespace app\utils\Pulse;

class PulseService
{
    private  $endpoint;
    private  $app;
    private  $groupId;
    private  $requestHeaderToken = null;

    private const VALID_TYPES = ['error', 'warn', 'info', 'debug', 'critical'];

    public function __construct($app, $groupId, $requestHeaderToken = null)
    {
        $this->endpoint = 'https://api-pulse.704app.com.br/logs';
        $this->app = $app;
        $this->groupId = $groupId;
        $this->requestHeaderToken = $requestHeaderToken;
    }

    public function handle($message, $context, $type)
    {
        if (!in_array($type, self::VALID_TYPES, true)) {
            $type = 'info';
        }

        $payload = [
            'type'    => $type,
            'message' => $message,
            'app'     => $this->app,
            'context' => $context,
            'groupId' => $this->groupId,
        ];


        $ch = curl_init($this->endpoint);

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array_filter([
            'Content-Type: application/json',
            $this->requestHeaderToken ? 'Authorization: ' . $this->requestHeaderToken : null,
        ]));

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT_MS, 1000);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT_MS, 1000);

        curl_exec($ch);
        curl_close($ch);
    }
}
