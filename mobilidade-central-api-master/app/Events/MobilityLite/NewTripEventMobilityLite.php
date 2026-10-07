<?php

namespace App\Events\MobilityLite;

class NewTripEventMobilityLite
{
    public $payload;

    public function __construct(array $payload)
    {
        $this->payload = $payload;
    }
}
