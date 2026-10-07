<?php

namespace App\Services\Realtime\Chat;

use App\Constants\Trip\TripEvents;
use App\Contracts\Realtime\ChatRealtimeService;
use App\Realtimes\Chat\MessagesChatTrip;
use App\Realtimes\Clients\ChatRealtimeApiClient;

class SocketChatRealtimeService implements ChatRealtimeService
{
    /** @var ChatRealtimeApiClient */
    private $clientApi;

    public function __construct(ChatRealtimeApiClient $clientApi)
    {
        $this->clientApi = $clientApi;
    }

    public function createMessage(MessagesChatTrip $messagesChatTrip): ?array
    {
        $result = $this->dispatch(TripEvents::CHAT_MESSAGE_CREATED, $messagesChatTrip);
        return $result['error'] ? null : $messagesChatTrip->toArray();
    }

    public function deleteMessage(MessagesChatTrip $messagesChatTrip): bool
    {
        $result = $this->dispatch(TripEvents::CHAT_MESSAGE_DELETED, $messagesChatTrip);
        return $result['error'] ? false : true;
    }

    public function deleteMessagesByTripReference(string $tripReference): bool
    {
        $result = $this->dispatch(TripEvents::CHAT_MESSAGE_DELETED, null);
        return $result['error'] ? false : true;
    }

    private function dispatch(string $event, ?MessagesChatTrip $messagesChatTrip): array
    {
        return $this->clientApi->sendEvent([
            'event' => $event,
            'message' => $messagesChatTrip ? $messagesChatTrip->toArray() : null
        ]);
    }
}
