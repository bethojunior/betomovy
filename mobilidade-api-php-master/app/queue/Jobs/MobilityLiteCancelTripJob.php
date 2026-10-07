<?php

namespace app\queue\Jobs;

use app\model\Config;
use app\queue\JobInterface;
use app\utils\Pulse\GroupIds;
use app\utils\Pulse\PulseService;
use GuzzleHttp\Client;

class MobilityLiteCancelTripJob implements JobInterface
{
  private $pulseService;
  private $appName;

  public function __construct()
  {
    $pulseGroup = Config::get('pulse_group') ?? GroupIds::DEFAULT_GROUP;
    $pulseApp = Config::get('app_title') . ' | API-PHP';

    $this->appName = Config::get('app_name') ?? 'voutehomologarnew';
    $this->pulseService = new PulseService($pulseApp, $pulseGroup);
  }

  public function handle(array $payload): void
  {
    try {
      echo "\nJob inserido na fila com sucesso\n";
      echo "\nPayload: " . json_encode($payload['tripReference']) . "\n";

      $this->executeTransaction($payload['tripReference']);
    } catch (\Throwable $th) {
      $this->pulseService->handle(
        '[ERRO TO CANCEL TRIP IN MOBILITY LITE]' . $th->getMessage(),
        $th->getTraceAsString(),
        'critical'
      );
      echo "\nErro ao inserir job na fila: " . $th->getMessage() . "\n";
    }
  }

  public function executeTransaction(string $tripReference): void
  {
    try {
      echo "\nExecutando job de integração com Mobility Lite\n";

      $apiUrl = env('API_MOBILITY_LITE_URL') . 'trip-events/cancel-trip';
      $client = new Client();

      $newTripMobilityLite = $client->request('POST', $apiUrl, [
        'headers' => [
          'Content-Type' => 'application/json',
        ],
        'json' => ['tripReference' => $tripReference, 'appName' => $this->appName]
      ]);

      $responseJson = json_decode($newTripMobilityLite->getBody(), true);

      echo "\nJob de integração com Mobility Lite executado com sucesso\n";
      echo "\nResposta da API Mobility Lite: " . json_encode($responseJson) . "\n";
    } catch (\Throwable $th) {
      $this->pulseService->handle(
        '[ERRO TO CANCEL TRIP IN MOBILITY LITE]' . $th->getMessage(),
        $th->getTraceAsString(),
        'critical'
      );
      echo "\nErro ao executar job de integração com Mobility Lite: " . $th->getMessage() . "\n";
    }
  }
}
