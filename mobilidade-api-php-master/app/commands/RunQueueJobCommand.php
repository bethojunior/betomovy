<?php

namespace app\commands;

use app\queue\JobInterface;
use app\utils\Command;

class RunQueueJobCommand extends Command
{
    public function handle(): void
    {
        $jobClass = $this->params[2] ?? null;
        $encodedPayload = $this->params[3] ?? null;

        if (!$jobClass || !$encodedPayload || !class_exists($jobClass)) {
            throw new \Exception('Job inválido');
        }

        $instance = new $jobClass();

        if (!$instance instanceof JobInterface) {
            throw new \Exception('Classe não implementa JobInterface');
        }

        $payload = json_decode(base64_decode($encodedPayload), true);

        if (!is_array($payload)) {
            throw new \Exception('Payload inválido');
        }

        $instance->handle($payload);
        $this->response = true;
    }
}
