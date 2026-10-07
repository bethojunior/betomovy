<?php

namespace app\queue;

interface JobInterface
{
  public function handle(array $payload): void;
}
