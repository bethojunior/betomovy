<?php

namespace app\queue\Jobs;

use app\dao\CalculatedTripPriceDao;
use app\model\CalculatedTripPrice;
use app\queue\JobInterface;
use app\queue\Queue;

class InsertQueueJob implements JobInterface
{
  public function handle(array $payload): void
  {
    try {
      if (!isset($payload['tableToInsert'], $payload['data'])) {
        throw new \Exception("Payload inválido");
      }

      (new CalculatedTripPriceDao())->insert($payload['data']);

      echo "\nJob inserido na fila com sucesso \n";

    } catch (\Throwable $th) {
      // Queue::dispatch(
      //   PulseJob::class,
      //   [
      //     'message' => $th->getMessage(),
      //     'context' => $th->getTrace(),
      //     'type' => 'critical'
      //   ]
      // );
      echo "\n" . $th->getMessage() . "\n";
    }
  }
}
