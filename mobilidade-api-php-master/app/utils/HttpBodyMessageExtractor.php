<?php

namespace app\utils;

class HttpBodyMessageExtractor
{
    public static function extract(array $body, string $raw): string
    {
        return $body['message'] ?? $body['error'] ?? (is_string($raw) ? $raw : '') ?: 'Unknown error';
    }
}
