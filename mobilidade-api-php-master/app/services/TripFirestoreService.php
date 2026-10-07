<?php

namespace app\services;

use app\contracts\TripRealtimeServiceInterface;
use app\utils\CloudFirestore;

class TripFirestoreService implements TripRealtimeServiceInterface
{
    /** @var CloudFirestore */
    private $cloudFirestore;

    public function __construct(CloudFirestore $cloudFirestore)
    {
        $this->cloudFirestore = $cloudFirestore;
    }

    public function create(array $trip): void
    {
        $tripReference = $trip['tripReference'];

        $this->cloudFirestore->setDocumentId($tripReference)->save($trip);
    }

    public function update(array $trip): void
    {
        $tripReference = $trip['tripReference'];

        $this->cloudFirestore->setDocumentId($tripReference)->update($trip);
    }

    public function delete(array $trip): void
    {
        $tripReference = $trip['tripReference'];

        $this->cloudFirestore->setDocumentId($tripReference)->delete();
    }
}
