<?php

namespace App\Events;

use App\Integrations\Notifier\NotifierIntegration;

class TripGroupNotificationWpp
{
    private NotifierIntegration $notifier;

    public function __construct(NotifierIntegration $notifier)
    {
        $this->notifier = $notifier;
    }

    public function handle(int $centralId): void
    {
        $this->notifier->init($centralId);
        $this->notifier->handleGroupDriver();
    }
}
