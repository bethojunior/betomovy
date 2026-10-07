<?php

class WhatsappFeature
{
    /** @var bool|null */
    private static $centralEnabled = null;

    /**
     * Verifica se a central tem WhatsApp habilitado via API de config.
     */
    public static function isCentralEnabled(): bool
    {
        if (self::$centralEnabled !== null) {
            return self::$centralEnabled;
        }

        $user = Session::get('user');
        $apiHost = getenv('API_HOST');

        if (!$user || !$apiHost) {
            self::$centralEnabled = false;
            return false;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, rtrim($apiHost, '/') . '/config/enable_whatsapp_central');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 3);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'token: ' . $user->api_token,
            'userid: ' . $user->idUser,
            'Content-Type: application/json',
        ]);
        $response = curl_exec($ch);
        curl_close($ch);

        if (!$response) {
            self::$centralEnabled = false;
            return false;
        }

        $config = json_decode($response);
        self::$centralEnabled = $config && $config->status && $config->response !== '0';

        return self::$centralEnabled;
    }
}
