<?php

namespace App\Services\Trip\ChatTrip;

use App\Repositories\Trip\ChatTrip\MessagesChatTripRepository;
use Illuminate\Database\Eloquent\Collection;

class MessagesChatTripService
{
    public function __construct(MessagesChatTripRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getMessagesByTrip(string $tripReference): array
    {
        $messages = $this->repository->getMessagesByTrip($tripReference);

        return array_map(function ($message) {
            $message['isDriver'] = (bool) $message['isDriver'];
            $message['isAudio'] = (bool) $message['isAudio'];
            return $message;
        }, $messages->toArray());
    }
}
