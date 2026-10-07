<?php

namespace App\Services\Notification;

use App\Repositories\Notification\EventNotificationTypeRepository;

class EventNotificationTypeService
{
    private $repository;

    public function __construct(EventNotificationTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->all();
    }
}
