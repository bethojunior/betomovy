<?php

namespace app\dao;

use GuzzleHttp\Client;
use Exception;
use app\model\IntegrationPartnersLog;
use app\dao\IntegrationPartnersDao;

class WebhookDao
{
    private $client;

    public function __construct()
    {
        $this->client = new Client();
    }

    /**
     * Envia dados para todas as URLs dos parceiros de integração.
     *
     * @param array $data
     * @return string
     * @throws Exception
     */
    public function sendDataToAllPartners(array $data)
    {
        try {
            // Buscar todas as URLs dos parceiros
            $integrationPartnersDao = new IntegrationPartnersDao();
            $partners = $integrationPartnersDao->findAllPartners();

            foreach ($partners as $partner) {
                $response = $this->client->post($partner->url, [
                    'json' => $data
                ]);

                if ($response->getStatusCode() !== 200) {
                    throw new Exception("Erro ao enviar dados para a URL: " . $partner->url);
                }
            }

            return 'Dados enviados com sucesso para todos os parceiros!';
        } catch (Exception $e) {
            throw new Exception("Erro ao enviar dados para os parceiros de integração: " . $e->getMessage());
        }
    }
}
