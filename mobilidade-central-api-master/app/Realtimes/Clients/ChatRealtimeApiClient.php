<?php

namespace App\Realtimes\Clients;
class ChatRealtimeApiClient extends AbstractRealtimeApiClient
{
    protected function getEndpoint(): string
    {
        return "/webhook/chat";
    }

    protected function getWebhookType(): string
    {
        return "chat";
    }
}
