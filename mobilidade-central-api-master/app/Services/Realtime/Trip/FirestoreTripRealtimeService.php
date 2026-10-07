<?php

namespace App\Services\Realtime\Trip;

use App\Contracts\Realtime\TripRealtimeService;
use App\Contracts\Repository\CloudFirestoreRepository;
use App\Realtimes\Trip\Trip;

class FirestoreTripRealtimeService implements TripRealtimeService
{
    /** @var CloudFirestoreRepository */
    private $cloudFirestore;

    public function __construct(CloudFirestoreRepository $cloudFirestore)
    {
        $this->cloudFirestore = $cloudFirestore;
    }

    public function create(Trip $trip): ?array
    {
        $fields = $trip->toArray();

        return (array) $this->cloudFirestore
            ->setDocumentId($trip->getTripReference())
            ->save($fields);
    }

    public function update(Trip $trip): ?array
    {
        $fields = $trip->toArray();

        return (array) $this->cloudFirestore
            ->setDocumentId($trip->getTripReference())
            ->save($fields, ['merge' => true]);
    }

    public function delete(Trip $trip): bool
    {
        return $this->cloudFirestore
            ->setDocumentId($trip->getTripReference())
            ->delete();
    }
}
