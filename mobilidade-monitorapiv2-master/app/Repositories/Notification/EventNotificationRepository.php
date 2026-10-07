<?php

namespace App\Repositories\Notification;

use App\Constants\Notification\EventNotificationConst;
use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Notification\EventNotification;

class EventNotificationRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(EventNotification::class);
    }

    public function findByEventType($eventNotificationType)
    {
        return $this->getModel()
            ::where("eventNotificationTypeId", $eventNotificationType)
            ->where("statusId", StatusConst::ACTIVE)
            ->first();
    }


    public function findAll()
    {
        return $this->getModel()
            ::where("statusId", StatusConst::ACTIVE)
            ->with(["eventNotificationType"])
            ->get();
    }

    public function disableEventByType($eventNotificationTypeId)
    {
        $this->getModel()
            ::where("statusId",StatusConst::ACTIVE)
            ->where("eventNotificationTypeId", $eventNotificationTypeId)
            ->update([
                'statusId' => StatusConst::REMOVED
            ]);
    }
}
