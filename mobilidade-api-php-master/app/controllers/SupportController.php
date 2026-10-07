<?php

namespace app\controllers;

use app\model\AcquirerMetaData;
use app\services\CityConfigService;
use app\services\HelpAlertService;
use app\utils\Headers;
use app\model\Config;
use app\model\ConfigType;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/10/2018
 * Time: 10:01
 */
class SupportController extends ApiController
{
    public function actionGetHelpCode()
    {
        try {
            echo $this->returnSuccess("Exibindo help code",
                Config::get('support_help_code', ConfigType::SUPPORT)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGoogleApiKey()
    {
        try {
            echo $this->returnSuccess("APIKEY encontrada",
                (new CityConfigService)
                    ->googleApiKeyFront($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * Método genérico para buscar qualquer configuração na tabela do configs
     */
    public function actionGetConfig()
    {
        $request = $this->request(false);

        try {
            if ($request->configKey === 'mp_public_key') {
                echo $this->returnSuccess("CONFIG encontrada",
                    AcquirerMetaData::get($request->configKey)
                );
                return;
            }
            echo $this->returnSuccess("CONFIG encontrada",
                Config::get($request->configKey, $request->type ?? null)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionSendAlertHelp()
    {
        try {
            echo $this->returnSuccess(
                "Botão de pânico foi acionado com sucesso",
                (new HelpAlertService)->askForHelp($this->request(false), Headers::getUserId()));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionSendAlertHelpWithData()
    {
        try {
            $request = [
                'lat' => $_POST['lat'],
                'lng' => $_POST['lng'],
                'emergencyMonitoringTypeId' => $_POST['emergencyMonitoringTypeId'] ?? null,
                'photo' => $_FILES['photo'] ?? null
            ];
            $request = json_decode(json_encode($request));

            echo $this->returnSuccess(
                "Botão de pânico foi acionado com sucesso",
                (new HelpAlertService)->askForHelpWithData($request, Headers::getUserId()));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}