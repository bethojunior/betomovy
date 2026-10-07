<?php

namespace App\Events;

use App\Integrations\Notifier\NotifierIntegration;

class TripDriverNotificationWpp
{
    private NotifierIntegration $notifier;

    public function __construct(NotifierIntegration $notifier)
    {
        $this->notifier = $notifier;
    }

    public function handle($driverId, int $centralId): void
    {
        $this->notifier->init($centralId);
        $this->notifier->handleDriver($driverId);
    }
}
