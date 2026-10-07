<?php

namespace app\contracts;

interface TripRealtimeServiceInterface
{
    public function create(array $trip): void;
    public function update(array $trip): void;
    public function delete(array $trip): void;
}
