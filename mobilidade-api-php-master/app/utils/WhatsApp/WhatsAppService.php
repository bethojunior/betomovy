<?php

namespace app\utils\WhatsApp;

use app\model\Config;

class WhatsAppService
{
    private string $sessionName;
    private string $endPoint;
    private string $endPointGroup;

    public function __construct()
    {
        $this->sessionName = env("APP_NAME");
        $this->endPoint = 'https://api-notifier.704app.com.br/whatsapp/send-message';
        $this->endPointGroup = 'https://api-notifier.704app.com.br/whatsapp/send-message-group';
    }

    public function handle($phoneNumber, $message): bool
    {
        try {
            $phone = preg_replace('/\D/', '', $phoneNumber);
            $payload = [
                'message'     => $message,
                'sessionName' => $this->sessionName,
                'phoneNumber' => $phone,
            ];

            $ch = curl_init($this->endPoint);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
            ]);

            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_NOSIGNAL, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            error_log("WhatsApp API Response: " . $response);
            error_log("WhatsApp API HTTP Code: " . $httpCode);

            if ($error) {
                error_log("WhatsApp cURL Error: " . $error);
                return false;
            }

            return $httpCode >= 200 && $httpCode < 300;
        } catch (\Exception $e) {
            error_log("WhatsApp Exception: " . $e->getMessage());
            return false;
        }
    }

    public function handleGroupId($message, $groupId)
    {
        try {
            $payload = [
                'message'     => $message,
                'sessionName' => $this->sessionName,
                'groupId' => $groupId,
            ];

            $ch = curl_init($this->endPointGroup);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
            ]);

            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_NOSIGNAL, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            error_log("WhatsApp API Response: " . $response);
            error_log("WhatsApp API HTTP Code: " . $httpCode);

            if ($error) {
                error_log("WhatsApp cURL Error: " . $error);
                return false;
            }

            return $httpCode >= 200 && $httpCode < 300;
        } catch (\Exception $e) {
            error_log("WhatsApp Exception: " . $e->getMessage());
            return false;
        }
    }
}
