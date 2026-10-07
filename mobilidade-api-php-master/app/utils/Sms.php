<?php

namespace app\utils;

use app\constant\ExternalServiceActionConst;
use app\constant\ExternalServiceConst;
use app\constant\ExternalServiceTypeConst;
use app\contracts\SmsApiInterface;
use app\dao\ExternalServiceActiveDao;
use app\dao\ExternalServiceUseDao;
use app\model\Config;
use app\model\ExternalService;
use app\model\ExternalServiceMetaData;
use app\model\ExternalServiceUse;
use app\utils\WhatsApp\WhatsAppService;

/**
 * Created by PhpStorm.
 * User: fabrica704
 * Date: 09/05/18
 * Time: 09:28
 */
class Sms
{
    private $zenvia;
    private $smsService;
    private $number;
    private $message;
    private $from;

    const ZENVIA_KEY = "aGVnaGJlcnRoby5zbXNvbmxpbmU6NUtsclR5WFpmdA=="; // heghbertho.smsonline:5KlrTyXZft
    const ZENVIA_BACKUP_KEY = "cm9kcmlnby5jb3JwLmFwaTpQbXRTV3FXSkRE"; // rodrigo.corp.api:PmtSWqWJDD

    public function __construct($number = null, $message = null, $from = null)
    {
        $this->number = PhoneNumberNormalizer::toDialable($number);
        $this->message = $message;
        $this->from = $from ?? Config::get('app_title');
        $this->zenvia = new Zenvia(
            $this->number,
            $this->message,
            $this->from,
            ExternalServiceMetaData::get('zenvia_key'));

        $this->smsService = $this->getSmsApiActive();
    }

    /**
     * @param string $number
     * @return Sms
     */
    public function setNumber(string $number): Sms
    {
        $this->number = $number;
        $this->zenvia->setNumber($number);
        return $this;
    }

    /**
     * @param null $message
     * @return Sms
     */
    public function setMessage($message)
    {
        $this->message = $message;
        $this->zenvia->setMessage($message);
        return $this;
    }

    /**
     * @param null $from
     * @return Sms
     */
    public function setFrom($from)
    {
        $this->from = $from;
        $this->zenvia->setFrom($from);
        return $this;
    }

    public static function generateConfirmationCode()
    {
        return mt_rand(1000, 9999);
    }

    // public function send(
    //     int $externalServiceActionId = ExternalServiceActionConst::GENERAL_ACTION, $withBackupKey = true)
    // {
    //     $externalServiceAction = (new ExternalServiceActiveDao)
    //         ->findActiveByAction($externalServiceActionId);
    //     $response = [];
    //     switch ($externalServiceAction->externalServiceTypeId) {
    //         case null:
    //             $response['sms'] = $this->triggerSms($externalServiceActionId, $withBackupKey);
    //             $response['whatsapp'] = $this->triggerOurWhatsApp();

    //             break;
    //         case ExternalServiceTypeConst::SMS:
    //             $response['sms'] = $this->triggerSms($externalServiceActionId, $withBackupKey);
    //             break;
    //         case ExternalServiceTypeConst::WHATSAPP:
    //             $response['whatsapp'] = $this->triggerOurWhatsApp();
    //             break;
    //     }
    //     return $response;
    // }

    public function send(int $externalServiceActionId = ExternalServiceActionConst::GENERAL_ACTION, $withBackupKey = true)
    {
        $externalServiceAction = (new ExternalServiceActiveDao)
            ->findActiveByAction($externalServiceActionId);

        $activeServiceTypes = $externalServiceAction->activeServiceTypes ?? [];
        $response = [];

        if (empty($activeServiceTypes)) {
            $response['whatsapp'] = $this->triggerOurWhatsApp($externalServiceActionId);
            return $response;
        }

        if (in_array(ExternalServiceTypeConst::WHATSAPP, $activeServiceTypes)) {
            $response['whatsapp'] = $this->triggerOurWhatsApp($externalServiceActionId);
        }

        if (in_array(ExternalServiceTypeConst::SMS, $activeServiceTypes)) {
            $response['sms'] = $this->triggerSms($externalServiceActionId, $withBackupKey);
        }

        return $response;
    }

    public function sendOnlyWhatsApp(int $externalServiceActionId = ExternalServiceActionConst::GENERAL_ACTION)
    {
        return $this->triggerWhatsApp($externalServiceActionId);
    }

    private function triggerWhatsApp(int $externalServiceActionId)
    {
        $message = $this->message;

        if ($this->from)
            $message = "{$this->from}: {$this->message}";

        $response = (new WhatsAppService)
            ->sendText($this->number, $message);

        $use = new ExternalServiceUse;
        $use
            ->setExternalServiceId((new WhatsAppService)->getExternalServiceId())
            ->setExternalServiceActionId($externalServiceActionId)
            ->setMessage($message)
            ->setTo($this->number);

        (new ExternalServiceUseDao)->sqlInsert($use);

        return $response;
    }

    private function triggerSms(int $externalServiceActionId, $withBackupKey = true)
    {
//        $responseSms = $this->zenvia->send();
        $responseSms = $this->smsService->send();
        $used = true;

//        if (!isset($responseSms->sendSmsResponse->statusCode) || $responseSms->sendSmsResponse->statusCode == Zenvia::ZENVIA_ERROR_CODE) {
//            (new LogDao)
//                ->logApplication("Erro ao enviar sms com o a chave " . (!$withBackupKey ? "de backup" : "principal"), $responseSms);
//
//            $used = false;
//
//            if ($withBackupKey) {
//                $this->zenvia->setKey(ExternalServiceMetaData::get('zenvia_bkp_key'));
//                return $this->triggerSms($externalServiceActionId, false);
//            }
//        }

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

    private function triggerOurWhatsApp() {
        return (new WhatsAppService)->handle($this->number, $this->message);
    }

    private function getSmsApiActive(): SmsApiInterface
    {
        switch (ExternalService::findActiveByType(ExternalServiceTypeConst::SMS)) {
            case ExternalServiceConst::ZENVIA:
                return new Zenvia($this->number, $this->message, $this->from);
            case ExternalServiceConst::ZENVIA_BKP:
                return new Zenvia($this->number, $this->message, $this->from, true);
            case ExternalServiceConst::MEX10:
                return new Mex10($this->number, $this->message);
            case ExternalServiceConst::MILTO_SERVICE_SMS:
                return new MiltoServiceSmsApi($this->number, $this->message);
        }
    }
}