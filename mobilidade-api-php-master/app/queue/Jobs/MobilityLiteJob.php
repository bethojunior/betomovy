<?php

namespace app\queue\Jobs;

use app\model\Config;
use app\queue\JobInterface;
use app\utils\Pulse\GroupIds;
use app\utils\Pulse\PulseService;
use GuzzleHttp\Client;

class MobilityLiteJob implements JobInterface
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
      echo "\nPayload: " . json_encode($payload['trip']) . "\n";

      $this->executeTransaction($payload['trip']);
    } catch (\Throwable $th) {
      $this->pulseService->handle(
        '[ERRO TO STORE NEW TRIP IN MOBILITY LITE]' . $th->getMessage(),
        $th->getTraceAsString(),
        'critical'
      );
      echo "\nErro ao inserir job na fila: " . $th->getMessage() . "\n";
    }
  }

  public function executeTransaction(array $payload)
  {
    try {
      echo "\nExecutando job de integração com Mobility Lite\n";

      $apiUrl = env('API_MOBILITY_LITE_URL') . 'trip-events/new-trip';
      $client = new Client();

      $newTripMobilityLite = $client->request('POST', $apiUrl, [
        'headers' => [
          'Content-Type' => 'application/json',
        ],
        'json' => $payload
      ]);

      $responseJson = json_decode($newTripMobilityLite->getBody(), true);

      echo "\nJob de integração com Mobility Lite executado com sucesso\n";
      echo "\nResposta da API Mobility Lite: " . json_encode($responseJson) . "\n";
    } catch (\Throwable $th) {
      $this->pulseService->handle(
        '[ERRO TO EXECUTE MOBILITY LITE JOB]' . $th->getMessage(),
        $th->getTraceAsString(),
        'critical'
      );
      echo "\nErro ao executar job de integração com Mobility Lite: " . $th->getMessage() . "\n";
    }
  }

  public function parseTripToMobilityLite(object $trip): array
  {
    return [
      "appName" => $this->appName,
      "tripReference" => $trip->tripReference,
      "price" => (float) $trip->price,

      "customer" => [
        "name" => trim($trip->customerName),
        "phone" => $trip->customerPhone ?? '',
      ],

      "origin" => [
        "address" => $trip->origin->address ?? '',
        "latitude" => (float) ($trip->origin->latitude ?? 0),
        "longitude" => (float) ($trip->origin->longitude ?? 0),
      ],

      "destination" => [
        "address" => $trip->destination->address ?? '',
        "latitude" => (float) ($trip->destination->latitude ?? 0),
        "longitude" => (float) ($trip->destination->longitude ?? 0),
      ],
    ];
  }
}
