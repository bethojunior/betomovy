<?php

namespace app\controllers;

use app\services\ConfigService;
use Exception;
use GuzzleHttp\Client;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/10/2019
 * Time: 09:27
 */
class ConfigController extends ApiController
{
    public function actionGeneral()
    {
        try {
            $result = (new ConfigService)
                ->generalConfigs();

            echo $this->returnSuccess("Configurações encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configurações");
        }
    }

    public function actionGetAppPartner()
    {
        try {
            $client = new Client();

            $apiUrl = env('URL_MONITOR_APIV2') . 'config_app_partners/get_all';

            $internalToken = ltrim(env('INTERNAL_TOKEN'), '^');

            $responseConfigAppPartners = $client->request('GET', $apiUrl, [
                'headers' => [
                    'token' => $internalToken,
                ]
            ]);

            $responseJson = json_decode($responseConfigAppPartners->getBody(), true);

            echo $this->returnSuccess("Configurações de apps parceiros capturados com sucesso.", $responseJson);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configurações de apps parceiros");
        }
    }
}
