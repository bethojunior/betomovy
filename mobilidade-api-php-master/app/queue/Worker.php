<?php

namespace app\queue;

class Worker
{
  private $redis;

  public function __construct($redis)
  {
    $this->redis = $redis;
  }

  public function run()
  {
    while (true) {

      try {

        $this->moveDelayed();

        $jobData = $this->redis->blpop(['queue:default'], 5);

        if (!$jobData) continue;

        $job = json_decode($jobData[1], true);

        $this->process($job);
      } catch (\Exception $e) {
        echo "Erro no worker: {$e->getMessage()}\n";
        sleep(2);
      }
    }
  }

  private function moveDelayed()
  {
    $now = time();
    $jobs = $this->redis->zrangebyscore('queue:default:delayed', 0, $now);

    foreach ($jobs as $jobJson) {
      $this->redis->multi();
      $this->redis->rpush('queue:default', $jobJson);
      $this->redis->zrem('queue:default:delayed', $jobJson);
      $this->redis->exec();
    }
  }

  private function process(array $job)
  {
    try {

      $class = $job['class'];

      if (!class_exists($class)) {
        throw new \Exception("Job {$class} não encontrado");
      }

      $instance = new $class();
      $instance->handle($job['payload']);

      echo "Job {$job['id']} processado\n";
    } catch (\Exception $e) {

      $job['attempts']++;

      if ($job['attempts'] >= $job['maxAttempts']) {

        $this->redis->rpush('queue:default:failed', json_encode($job));
      } else {

        $delay = 5;
        $this->redis->zadd(
          'queue:default:delayed',
          time() + $delay,
          json_encode($job)
        );
      }
    }
  }
}
