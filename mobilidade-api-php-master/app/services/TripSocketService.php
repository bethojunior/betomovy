<?php

namespace app\services;

use app\constant\TripSocketEvent;
use app\contracts\TripRealtimeServiceInterface;
use app\utils\TripRealtimeApiClient;

class TripSocketService implements TripRealtimeServiceInterface
{
    /** @var TripRealtimeApiClient */
    private $apiClient;

    public function __construct(TripRealtimeApiClient $apiClient)
    {
        $this->apiClient = $apiClient;
    }

    public function create(array $trip): void
    {
        $this->dispatch(TripSocketEvent::TRIP_CREATED, $trip);
    }

    public function update(array $trip): void
    {
        $this->dispatch(TripSocketEvent::TRIP_UPDATED, $trip);
    }

    public function delete(array $trip): void
    {
        $this->dispatch(TripSocketEvent::TRIP_DELETED, $trip);
    }

    private function dispatch(string $event, array $trip): void
    {
        $this->apiClient->postTripEvent([
            'event' => $event,
            'trip' => $trip
        ]);
    }
}
