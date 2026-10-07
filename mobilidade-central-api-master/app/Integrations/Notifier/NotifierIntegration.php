<?php

namespace App\Integrations\Notifier;

use App\Models\CentralWpp\CentralNotificationConfigWpp;
use App\Models\CentralWpp\CentralWpp;
use App\Models\User\Driver;

class NotifierIntegration
{
    private ?CentralNotificationConfigWpp $notificationConfig = null;
    private ?CentralWpp $wppConfig = null;

    public function init(int $centralId): void
    {
        $this->notificationConfig = CentralNotificationConfigWpp::where('centralId', $centralId)->first();
        $this->wppConfig = CentralWpp::where('centralId', $centralId)->first();
    }

    public function dispatch(array $props, bool $isGroup = false): void
    {
        $phone = $props['phoneNumber'] ?? null;

        if (empty($phone)) {
            return;
        }

        $props['phoneNumber'] = preg_replace('/\D/', '', $props['phoneNumber']);

        $baseUrl = config('services.notifier.url');
        $endpoint = $isGroup
            ? '/whatsapp/send-message-group'
            : '/whatsapp/send-message';

        $url = $baseUrl . $endpoint;

        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => json_encode($props),
            CURLOPT_RETURNTRANSFER => false,
            CURLOPT_TIMEOUT_MS => 200,
            CURLOPT_CONNECTTIMEOUT_MS => 200,
            CURLOPT_NOSIGNAL => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FORBID_REUSE => true,
            CURLOPT_FRESH_CONNECT => true,
        ]);

        curl_exec($ch);
        curl_close($ch);
    }


    public function handleDriver($driverId): void
    {
        if (!$this->notificationConfig || !$this->notificationConfig->send_to_driver) return;
        if (!$this->wppConfig) return;

        $driver = Driver::with('user')->where('idDriver', $driverId)->first();

        $this->dispatch([
            'sessionName' => $this->wppConfig->sessionName,
            'phoneNumber' => $driver->user->phone,
            'message'     => $this->notificationConfig->message_send_to_driver,
        ]);
    }

    public function handleGroupDriver(): void
    {
        if (!$this->notificationConfig || !$this->notificationConfig->send_to_group) return;
        if (!$this->wppConfig || !$this->notificationConfig->group_reference) return;

        $this->dispatch([
            'sessionName' => $this->wppConfig->sessionName,
            'groupId'     => $this->notificationConfig->group_reference,
            'message'     => $this->notificationConfig->message_send_to_group,
        ], true);
    }
}
