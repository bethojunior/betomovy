<?php

namespace App\Realtimes\Clients;
class TripRealtimeApiClient extends AbstractRealtimeApiClient
{
    protected function getEndpoint(): string
    {
        return "/webhook/trip";
    }

    protected function getWebhookType(): string
    {
        return "trip";
    }
}
