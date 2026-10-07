<?php

namespace App\Utils\Acquirers\Ipag;

class Webhook
{
    private $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function processWebhook()
    {
      $url = env("MOBILIDADE_URL", "");

      return $this->connection->post('app/api/notifications/webhooks', [
        "url" => $url . "paymentwebhook/ipagwebhook"
      ], false);
    }
}
