<?php

namespace app\commands;

use app\utils\Command;
use GuzzleHttp\Client;

class EventTripWebhookCommand extends Command
{
    private $trip;
    private $partners;

    public function __construct($params)
    {
        parent::__construct($params);
        $this->trip = json_decode($params[0] ?? '{}');
        $this->partners = json_decode($params[1] ?? '[]');
        
        echo "Trip Reference: " . ($this->trip->tripReference ?? 'N/A') . "\n";
        echo "Parceiros: " . count($this->partners) . "\n";
    }

    public function handle(): void
    {
        try {
            $client = new Client();
            foreach ($this->partners as $partner) {
                echo "Enviando webhook \n";

                $client = new Client();
                $response = $client->post($partner->url, [
                    'json' => [
                        'tripReference' => $this->trip->tripReference,
                        'object' => $this->trip,
                        'integration_partners_id' => $partner->id
                    ]
                ]);
                
                echo "Resposta do webhook: " . $response . "\n";
            }
            
            echo "Processo de envio de webhooks finalizado\n";
        } catch (\Exception $e) {
            echo "Erro ao enviar webhook: " . $e->getMessage() . "\n";
        }
    }
}