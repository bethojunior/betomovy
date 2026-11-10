<?php

namespace App\Providers;

class PulseProvider
{
    private string $endpoint = 'https://api.movymob.com/logs';
    private string $app;
    private string $groupId;

    private const VALID_TYPES = ['error', 'warn', 'info', 'debug', 'critical'];

    public function __construct(string $app, string $groupId)
    {
        $this->app = $app;
        $this->groupId = $groupId;
    }

    public function critical(string $message, string $context): void
    {
        $this->sendLog('critical', $message, $context);
    }

    public function error(string $message, string $context): void
    {
        $this->sendLog('error', $message, $context);
    }

    public function warn(string $message, string $context): void
    {
        $this->sendLog('warn', $message, $context);
    }

    public function debug(string $message, string $context): void
    {
        $this->sendLog('debug', $message, $context);
    }

    public function info(string $message, string $context): void
    {
        $this->sendLog('info', $message, $context);
    }

    private function sendLog(string $type, string $message, string $context): void
    {
        if (!in_array($type, self::VALID_TYPES)) {
            throw new \InvalidArgumentException("Invalid log type: $type");
        }

        $payload = [
            'type'    => $type,
            'message' => $message,
            'app'     => $this->app,
            'context' => $context,
            'groupId' => $this->groupId,
        ];

        $ch = curl_init($this->endpoint);

        curl_setopt_array($ch, [
            CURLOPT_POST               => true,
            CURLOPT_POSTFIELDS         => json_encode($payload),
            CURLOPT_HTTPHEADER         => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER     => false,
            CURLOPT_NOSIGNAL           => true,
            CURLOPT_TIMEOUT_MS         => 1,
            CURLOPT_CONNECTTIMEOUT_MS  => 1000,
            CURLOPT_WRITEFUNCTION      => function () { return 0; },
        ]);

        curl_exec($ch);
        curl_close($ch);
    }

}
