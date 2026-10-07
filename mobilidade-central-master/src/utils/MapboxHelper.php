<?php

class MapboxHelper
{
    private const CONFIG_KEY = 'mapbox_access_token';
    private const REQUEST_TIMEOUT = 5;

    private static $token = null;

    public static function getToken(): ?string
    {
        if (self::$token !== null) {
            return self::$token;
        }

        $user    = Session::get('user');
        $apiHost = getenv('API_HOST');

        if (!$user || !$apiHost) {
            return null;
        }

        $raw = self::fetchTokenConfig($apiHost, $user);

        if (!$raw) {
            return null;
        }

        self::$token = self::parseTokenResponse($raw);
        return self::$token;
    }

    private static function fetchTokenConfig(string $apiHost, $user): ?string
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, rtrim($apiHost, '/') . '/config/' . self::CONFIG_KEY);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, self::REQUEST_TIMEOUT);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, self::buildHeaders($user));
        $raw = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if (!$raw || $error) {
            return null;
        }

        return $raw;
    }

    private static function buildHeaders($user): array
    {
        return [
            'Content-Type: application/json',
            'token: '  . $user->api_token,
            'userid: ' . $user->idUser,
        ];
    }

    private static function parseTokenResponse(string $raw): ?string
    {
        $data = json_decode($raw, true);

        // Resposta: {"status": true, "response": "pk.ey...", "message": "Configuração encontrada"}
        if (!isset($data['status']) || !$data['status']) {
            return null;
        }

        $value = $data['response'] ?? null;

        if (!is_string($value) || empty($value)) {
            return null;
        }

        return $value;
    }
}
