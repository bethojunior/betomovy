<?php

namespace App\Repositories\Notification;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Notification\EventNotificationType;

class EventNotificationTypeRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(EventNotificationType::class);
    }
}
