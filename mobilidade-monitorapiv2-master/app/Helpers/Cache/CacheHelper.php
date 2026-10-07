<?php

namespace App\Helpers\Cache;

class CacheHelper
{
    public static function processKey($key)
    {
        return env('REDIS_NAME') . ':'. $key;
    }

    public static function apiPhpConfigCacheKey(string $key): string
    {
        return 'config_' . $key;
    }
}
