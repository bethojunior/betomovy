<?php

namespace app\utils;

use app\constant\ExternalServiceConst;
use app\constant\ExternalServiceTypeConst;
use app\contracts\WhatsAppApiInterface;
use app\model\ExternalService;
use app\model\ExternalServiceMetaData;

class WhatsAppService
{
    public function sendText(string $numberTo, string $message)
    {
        $activeService = ExternalService::findActiveByType(ExternalServiceTypeConst::WHATSAPP, $this->cityId);

        if ($activeService == ExternalServiceConst::MILTO_SERVICE_WHATSAPP) {
            $miltoServiceWhatsappApi = new MiltoServiceWhatsappApi();

            return $miltoServiceWhatsappApi->sendText($numberTo, $message);
        } else {
            $defaultApi = $this->getDefaultApi();

            return $defaultApi->sendText($numberTo, $message);
        }
    }

    public function getExternalServiceId(): int
    {
        return $this->getDefaultApi()->getExternalServiceId();
    }

    private function getDefaultApi(): ZapboxApi
    {
        list(
                'zapbox_token' => $token, 'zapbox_access_key' => $access_key
                ) =
                ExternalServiceMetaData::getMany('zapbox_token', 'zapbox_access_key');

            return new ZapboxApi($token, $access_key);
    }

}