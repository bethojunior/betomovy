<?php

namespace App\Services\Realtime\Chat;

use App\Contracts\Realtime\ChatRealtimeService;
use App\Contracts\Repository\CloudFirestoreRepository;
use App\Realtimes\Chat\MessagesChatTrip;

class FirestoreChatRealtimeService implements ChatRealtimeService
{
    /** @var CloudFirestoreRepository */
    private $cloudFirestore;

    public function __construct(CloudFirestoreRepository $cloudFirestore)
    {
        $this->cloudFirestore = $cloudFirestore;
    }

    public function createMessage(MessagesChatTrip $messagesChatTrip): ?array
    {
        return (array) $this->cloudFirestore
            ->setDocumentId($messagesChatTrip->getIdMessagesChatTrip())
            ->save($messagesChatTrip->toArray());
    }

    public function deleteMessage(MessagesChatTrip $messagesChatTrip): bool
    {
        return $this->cloudFirestore
            ->setDocumentId($messagesChatTrip->getIdMessagesChatTrip())
            ->delete();
    }

    public function deleteMessagesByTripReference(string $tripReference): bool
    {
        return $this->cloudFirestore
            ->deleteMany('tripReference', '=', $tripReference);
    }
}
