<?php

namespace app\queue\Jobs;

use app\dao\TripEventsDetailsDao;
use app\queue\JobInterface;
use app\queue\Queue;

class TripEventJob implements JobInterface
{
  public function handle(array $payload): void
  {

    try {
      $eventTrip = (new TripEventsDetailsDao())->store([
        'tripReference' => $payload['tripReference'],
        'event' => $payload['event'],
        'data' => $payload['data']
      ]);

      echo "\nJob inserido na fila com sucesso para o evento: " . $payload['event'] . "\n";
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
