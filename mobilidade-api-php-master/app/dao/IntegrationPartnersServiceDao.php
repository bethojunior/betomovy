<?php

namespace app\dao;

use app\dao\IntegrationPartnersDao;
use app\model\Config;
class IntegrationPartnersServiceDao
{
    public function sendTripDataToPartners($trip)
    {
        $integrationPartnersDao = new IntegrationPartnersDao();
        $partners = $integrationPartnersDao->findAllPartners();
    
        foreach ($partners as $partner) {
            $url = $partner->url;
            $data = json_encode([
                'tripReference' => $trip->tripReference,
                'object' => $trip,
                'integration_partners_id' => $partner->id,
                // 'app' => Config::get('app_title'),
                'app' => env("APP_NAME")
            ]);
    
            $cmd = "curl -X POST -H 'Content-Type: application/json' -d " . escapeshellarg($data) . " " . escapeshellarg($url) . " > /dev/null 2>/dev/null &";
            exec($cmd);
        }
    }
}
