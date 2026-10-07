<?php

namespace app\queue\Jobs;


use app\queue\JobInterface;
use app\utils\WhatsApp\WhatsAppService;

class TestQueueJob implements JobInterface
{
  public function handle(array $payload): void
  {
    $whatsAppService = new WhatsAppService();
    $whatsAppService->handle($payload['phoneNumber'], $payload['message']);
  }
}
