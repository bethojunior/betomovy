<?php

namespace app\traits;

trait PaymentWebhook
{
    protected function hasWebhookUrl(): bool
    {
        return (bool) env('API_PHP_URL');
    }

    protected function webhookUrl(string $path): string
    {
        $apiBaseUrl = rtrim((string) (env('API_PHP_URL') ?: ''), '/');
        $path       = ltrim($path, '/');

        if ($apiBaseUrl === '') {
            return '/' . $path;
        }

        return $apiBaseUrl . '/' . $path;
    }
}
