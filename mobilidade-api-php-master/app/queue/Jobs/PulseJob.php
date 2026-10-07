<?php

namespace app\queue\Jobs;

use app\model\Config;
use app\queue\JobInterface;
use app\utils\Pulse\GroupIds;
use app\utils\Pulse\PulseService;

class PulseJob implements JobInterface
{
  private $pulseService;
  public function __construct()
  {
    $pulseGroup = Config::get('pulse_group') ?? GroupIds::DEFAULT_GROUP;
    $pulseApp = Config::get('app_title') . ' | API-PHP';


    $this->pulseService = new PulseService($pulseApp, $pulseGroup);
  }
  public function handle(array $payload): void
  {
    try {
      $this->pulseService->handle(
        $payload['message'] ?? 'Mensagem de log sem conteúdo',
        $payload['context'] ?? 'Mensagem de log sem conteúdo',
        $payload['type'] ?? 'info'
      );

      echo "\nJob inserido na fila com sucesso\n";
    } catch (\Throwable $th) {
      echo "\nErro ao inserir job na fila: " . $th->getMessage() . "\n";
    }
  }
}
