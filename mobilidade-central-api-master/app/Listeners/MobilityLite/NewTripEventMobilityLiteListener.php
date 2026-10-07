<?php

namespace App\Listeners\MobilityLite;

use App\Events\MobilityLite\NewTripEventMobilityLite;
use GuzzleHttp\Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Providers\PulseProvider;
use App\Utils\Pulse\GroupIds;
use Illuminate\Support\Facades\Log;

class NewTripEventMobilityLiteListener implements ShouldQueue
{
    private PulseProvider $pulseProvider;

    public function __construct()
    {
        $this->pulseProvider = new PulseProvider(
            "central-" . env('APP_NAME', 'laravel'),
            GroupIds::CENTRAL_PROD
        );
    }

    public function handle(NewTripEventMobilityLite $event)
    {
        Log::info('🔥 Entrou no listener NewTripEventMobilityLiteListener', [
            'payload' => $event->payload
        ]);

        $this->pulseProvider->info(
            "New mobility lite event :: " . json_encode($event->payload),
            self::class
        );

        try {
            $apiUrl = env('API_MOBILITY_LITE_URL') . 'trip-events/new-trip';

            $payload = $this->parseTripToMobilityLite($event->payload);

            Log::info('🚀 FINAL PAYLOAD', $payload);

            $this->pulseProvider->info(
                "Props params to mobility lite api :: " . json_encode($payload),
                self::class
            );

            $client = new Client();

            $response = $client->request('POST', $apiUrl, [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'json' => $payload
            ]);

            Log::info('✅ RESPONSE MOBILITY LITE', [
                'status' => $response->getStatusCode(),
                'body' => json_decode($response->getBody(), true)
            ]);
        } catch (\Throwable $th) {
            Log::error('❌ ERROR MOBILITY LITE', [
                'message' => $th->getMessage(),
            ]);

            $this->pulseProvider->error(
                "Error to send event trip to mobility lite",
                $th->getMessage()
            );
        }
    }

    private function parseTripToMobilityLite(array $trip): array
    {
        return [
            'appName' => $trip['appName'] ?? '',
            'tripReference' => $trip['tripReference'] ?? '',
            'price' => (float) ($trip['price'] ?? 0),
            'distance' => (float) ($trip['distance'] ?? 0),
            'tripTime' => (int) ($trip['tripTime'] ?? 0),

            'drivers' => $trip['drivers'] ?? [],
            'tripWayPoints' => $trip['tripWayPoints'] ?? [],

            'origin' => [
                'address' => $trip['origin']['address'] ?? '',
                'latitude' => (float) ($trip['origin']['latitude'] ?? 0),
                'longitude' => (float) ($trip['origin']['longitude'] ?? 0),
            ],

            'destination' => [
                'address' => $trip['destination']['address'] ?? '',
                'latitude' => (float) ($trip['destination']['latitude'] ?? 0),
                'longitude' => (float) ($trip['destination']['longitude'] ?? 0),
            ],

            'customer' => [
                'name' => trim($trip['customer']['name'] ?? ''),
                'phone' => $trip['customer']['phone'] ?? '',
            ],
        ];
    }
}
