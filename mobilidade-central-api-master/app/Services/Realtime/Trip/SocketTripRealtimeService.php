<?php

namespace App\Services\Realtime\Trip;

use App\Constants\Trip\TripEvents;
use App\Contracts\Realtime\TripRealtimeService;
use App\Realtimes\Clients\TripRealtimeApiClient;
use App\Realtimes\Trip\Trip;

class SocketTripRealtimeService implements TripRealtimeService
{
    /** @var TripRealtimeApiClient */
    private $clientApi;

    public function __construct(TripRealtimeApiClient $clientApi)
    {
        $this->clientApi = $clientApi;
    }

    public function create(Trip $trip): ?array
    {
        $result = $this->dispatch(TripEvents::TRIP_CREATED, $trip);
        return $result['error'] ? null : $trip->toArray();
    }

    public function update(Trip $trip): ?array
    {
        $result = $this->dispatch(TripEvents::TRIP_UPDATED, $trip);
        return $result['error'] ? null : $trip->toArray();
    }

    public function delete(Trip $trip): bool
    {
        $result = $this->dispatch(TripEvents::TRIP_DELETED, $trip);
        return $result['error'] ? false : true;
    }

    private function dispatch(string $event, Trip $trip): array
    {
        return $this->clientApi->sendEvent([
            'event' => $event,
            'trip' => $trip->toArray()
        ]);
    }
}
