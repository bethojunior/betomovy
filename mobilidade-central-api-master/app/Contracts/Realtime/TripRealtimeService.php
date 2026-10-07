<?php

namespace App\Contracts\Realtime;

use App\Realtimes\Trip\Trip;

interface TripRealtimeService
{
    public function create(Trip $trip): ?array;
    public function update(Trip $trip): ?array;
    public function delete(Trip $trip): bool;
}
