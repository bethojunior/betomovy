<?php


namespace App\Utils;


use App\Constants\Config\ExternalServiceActionConst;
use App\Constants\Config\ExternalServiceConst;
use App\Models\ExternalService\ExternalServiceUse;
use App\Repositories\Config\ConfigRepository;
use App\Repositories\ExternalService\ExternalServiceMetaDataRepository;
use App\Repositories\Log\LogRepository;
use Illuminate\Support\Facades\Auth;

class Sms
{
    private $zenvia;
    private $number;
    private $message;
    private $from;

    public function __construct($number = null, $message = null, $from = null)
    {
        $number = empty($number) ?: (new ConfigRepository())->findByKey('code_phone_country')->value . $this->formatPhoneClear($number);
        $this->number = $number;
        $this->message = $message;
        $this->from = $from ?? (new ConfigRepository())->findByKey('app_title')->value;
        $this->zenvia = new Zenvia(
            $this->number,
            $this->message,
            $this->from,
            (new ExternalServiceMetaDataRepository())->findByKey('zenvia_key')->value
        );
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

    public function send(
        int $externalServiceActionId = ExternalServiceActionConst::GENERAL_ACTION, $withBackupKey = true)
    {
        $response = [];

        $response['sms'] = $this->triggerSms($externalServiceActionId, $withBackupKey);

        return $response;
    }

    private function triggerSms(int $externalServiceActionId, $withBackupKey = true)
    {
        $responseSms = $this->zenvia->send();

        $used = true;

        if (!isset($responseSms->sendSmsResponse->statusCode) || $responseSms->sendSmsResponse->statusCode == Zenvia::ZENVIA_ERROR_CODE) {
            (new LogRepository())->insert(
                $responseSms,
                "Erro ao enviar sms com o a chave " . (!$withBackupKey ? "de backup" : "principal"),
                (Auth::user())->idUser
            );

            $used = false;

            if ($withBackupKey) {
                $this->zenvia->setKeyAuthorization((new ExternalServiceMetaDataRepository())->findByKey('zenvia_key')->value);
                return $this->triggerSms($externalServiceActionId, false);
            }
        }

        if ($used) {
            $use = new ExternalServiceUse();
            $use->externalServiceId = ExternalServiceConst::ZENVIA;
            $use->externalServiceActionId = $externalServiceActionId;
            $use->message = $this->message;
            $use->to = $this->number;
            $use->save();
        }

        return $responseSms;
    }

    public function formatPhoneClear($value)
    {
        if (empty($value))
            return null;

        $phone = str_replace('(', '', $value);
        $phone = str_replace('-', '', $phone);
        $phone = str_replace(')', '', $phone);
        $phone = str_replace(' ', '', $phone);
        $phone = str_replace('.', '', $phone);
        $phone = str_replace('+', '', $phone);

        return $phone;
    }
}
