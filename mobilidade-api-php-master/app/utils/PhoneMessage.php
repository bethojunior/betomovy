<?php


namespace app\utils;

use app\constant\ExternalServiceActionConst;
use app\constant\ExternalServiceConst;
use app\constant\ExternalServiceTypeConst;
use app\contracts\SmsApiInterface;
use app\dao\ExternalServiceActiveChannelDao;
use app\dao\ExternalServiceUseDao;
use app\dao\LogDao;
use app\model\Config;
use app\model\ExternalService;
use app\model\ExternalServiceUse;
use app\utils\WhatsApp\WhatsAppService;

class PhoneMessage
{
    private $smsService;
    private $number;
    private $message;
    private $from;
    private $cityId;

    public function __construct($number = null, $message = null, $from = null, int $cityId = null)
    {
        $this->number = PhoneNumberNormalizer::toDialable($number);
        $this->message = $message;
        $this->from = $from ?? Config::get('app_title');
        $this->cityId = $cityId;
        $this->smsService = $this->getSmsApiActive();
    }

    public function setNumber(string $number): PhoneMessage
    {
        $this->number = $number;
        $this->smsService->setParameters(['number' => $number]);
        return $this;
    }

    public function setMessage(string $message): PhoneMessage
    {
        $this->message = $message;
        $this->smsService->setParameters(['message' => $message]);
        return $this;
    }

    public function setFrom(string $from): PhoneMessage
    {
        $this->from = $from;
        $this->smsService->setParameters(['from' => $from]);
        return $this;
    }

    public function setCity(int $cityId): PhoneMessage
    {
        $this->cityId = $cityId;
        $this->smsService = $this->getSmsApiActive();

        return $this;
    }

    public static function generateConfirmationCode(): int
    {
        return mt_rand(1000, 9999);
    }

    public function send(int $externalServiceActionId = ExternalServiceActionConst::DRIVER_ARRIVAL_NOTIFICATION_FOR_THIRD_PARTIES, $withBackupKey = true)
    {
        $response = [];

        $activeChannelDao = new ExternalServiceActiveChannelDao();

        $whatsappActive = $activeChannelDao->isChannelActive($externalServiceActionId, ExternalServiceTypeConst::WHATSAPP);
        $smsActive = $activeChannelDao->isChannelActive($externalServiceActionId, ExternalServiceTypeConst::SMS);

        if (!$whatsappActive && !$smsActive) {
            return $response;
        }

        if ($whatsappActive) {
            $response['whatsapp'] = $this->triggerOurWhatsApp($externalServiceActionId);
        }

        if ($smsActive) {
            $response['sms'] = $this->triggerSms($externalServiceActionId, $withBackupKey);
        }

        return $response;
    }

    public function sendOnlyWhatsApp(int $externalServiceActionId = ExternalServiceActionConst::DRIVER_ARRIVAL_NOTIFICATION_FOR_THIRD_PARTIES)
    {
        return $this->triggerOurWhatsApp($externalServiceActionId);
    }
    
    public function sendDriverArrivalNotification()
    {
        return $this->send();
    }

    private function triggerOurWhatsApp() {
        return (new WhatsAppService)->handle($this->number, $this->message);
    }

    private function triggerSms(int $externalServiceActionId, $withBackupKey = true)
    {
        $responseSms = $this->smsService->send();
        $used = true;
        if (!$responseSms->status) {
            (new LogDao)
                ->logApplication("Erro ao enviar sms com o a chave " . (!$withBackupKey ? "de backup " : "principal ") . $responseSms->errors->service, $responseSms);

            $used = false;

            if ($withBackupKey) {
                $this->smsService->useBackup();
                return $this->triggerSms($externalServiceActionId, false);
            }
        }
        if ($used) {
            $use = new ExternalServiceUse;
            $use
                ->setExternalServiceId(
                    $withBackupKey ? ExternalServiceConst::ZENVIA : ExternalServiceConst::ZENVIA_BKP)
                ->setExternalServiceActionId($externalServiceActionId)
                ->setMessage($this->message)
                ->setTo($this->number);

            (new ExternalServiceUseDao)->sqlInsert($use);
        }

        return $responseSms;
    }

    private function getSmsApiActive(): SmsApiInterface
    {
        switch (ExternalService::findActiveByType(ExternalServiceTypeConst::SMS, $this->cityId)) {
            case ExternalServiceConst::ZENVIA:
                return new Zenvia($this->number, $this->message, $this->from, $this->cityId);
            case ExternalServiceConst::ZENVIA_BKP:
                return new Zenvia($this->number, $this->message, $this->from, $this->cityId, true);
            case ExternalServiceConst::MEX10:
                return new Mex10($this->number, $this->message, $this->cityId);
            case ExternalServiceConst::MILTO_SERVICE_SMS:
                return new MiltoServiceSmsApi($this->number, $this->message);
        }
    }
}