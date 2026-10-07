<?php

namespace App\Contracts\Realtime;

use App\Realtimes\Chat\MessagesChatTrip;

interface ChatRealtimeService
{
    public function createMessage(MessagesChatTrip $messagesChatTrip): ?array;
    public function deleteMessage(MessagesChatTrip $messagesChatTrip): bool;
    public function deleteMessagesByTripReference(string $tripReference): bool;
}
