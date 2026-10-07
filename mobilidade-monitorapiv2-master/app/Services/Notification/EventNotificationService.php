<?php

namespace App\Services\Notification;

use App\Constants\StatusConst;
use App\Models\Notification\EventNotification;
use App\Repositories\Notification\EventNotificationRepository;

class EventNotificationService
{
    private $repository;

    public function __construct(EventNotificationRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insert(array $request)
    {
        $this->repository->disableEventByType($request['eventNotificationTypeId']);
        $eventNotification = new EventNotification($request);
        $eventNotification->save();
        return $eventNotification;
    }

    public function findAll()
    {
        return $this->repository->findAll();
    }

    public function delete($id)
    {
        $eventNotification = $this->repository->find($id);
        $eventNotification->statusId = StatusConst::REMOVED;
        $eventNotification->save();
    }
}
