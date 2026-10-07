<?php

/*
|--------------------------------------------------------------------------
| Origin Helpers
|--------------------------------------------------------------------------
|
| CORS_ALLOWED_ORIGINS holds a comma separated list of exact origins
| ("https://app.example.com"). "*" releases every origin and is only valid
| while CORS_SUPPORTS_CREDENTIALS is disabled - browsers reject the wildcard
| together with "Access-Control-Allow-Credentials: true".
|
| CORS_ALLOWED_ORIGIN_SUFFIXES holds a comma separated list of domains
| ("example.com" or "*.example.com"). Each one releases the domain itself and
| any of its sub-domains, on any port.
|
*/

$csvEnv = function (string $key, $default = '') : array {
    $values = array_map('trim', explode(',', (string) env($key, $default)));

    return array_values(array_unique(array_filter($values, 'strlen')));
};

$normalizeOrigin = function (string $origin) : string {
    $origin = strtolower(rtrim($origin, '/'));

    // Browsers never send the default port within the Origin header.
    return preg_replace(['~^(http://[^/]+):80$~', '~^(https://[^/]+):443$~'], '$1', $origin);
};

$normalizeSuffix = function (string $suffix) : string {
    $suffix = strtolower($suffix);
    $suffix = preg_replace('~^[a-z][a-z0-9+.-]*://~', '', $suffix); // scheme
    $suffix = explode('/', $suffix)[0];                             // path
    $suffix = explode(':', $suffix)[0];                             // port

    return trim($suffix, '.*');
};

$allowedOrigins = array_values(array_unique(
    array_map($normalizeOrigin, $csvEnv('CORS_ALLOWED_ORIGINS', env('APP_URL')))
));

$allowedOriginSuffixes = array_filter(
    array_map($normalizeSuffix, $csvEnv('CORS_ALLOWED_ORIGIN_SUFFIXES')),
    function (string $suffix) : bool {
        return (bool) preg_match('~^[a-z0-9-]+(?:\.[a-z0-9-]+)*$~', $suffix);
    }
);

$allowedOriginPatterns = array_values(array_unique(array_map(function (string $suffix) : string {
    return '~^https?://(?:[a-z0-9-]+\.)*' . preg_quote($suffix, '~') . '(?::\d+)?$~i';
}, $allowedOriginSuffixes)));

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => $allowedOrigins,

    'allowed_origins_patterns' => $allowedOriginPatterns,

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'Content-Disposition',
        'Retry-After',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
    ],

    'max_age' => (int) env('CORS_MAX_AGE', 3600),

    'supports_credentials' => (bool) env('CORS_SUPPORTS_CREDENTIALS', false),

];
