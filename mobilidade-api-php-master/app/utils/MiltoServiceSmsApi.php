<?php


namespace app\utils;

use app\constant\SeuMiltoMapsConst;
use app\contracts\SmsApiInterface;
use app\dao\DestinationDao;
use app\model\ExternalServiceMetaData;
use stdClass;
use Exception;

class MiltoServiceSmsApi implements SmsApiInterface
{
    /**
     * @var mixed
     */
    private $token_name;

    /**
     * @var mixed
     */
    private $token;

    /**
     * @var string $api_url_milto_sms
     */
    private string $api_url_milto_sms;

    /**
     * @var string $number
     */
    private $number;

    /**
     * @var string $message
     */
    private $message;

    /**
     * @var int $cityId
     */
    private $cityId;

    public function __construct(string $number = null, string $message = null, int $cityId = null)
    {
        $this->number = $number;
        $this->message = $message;
        $this->cityId = $cityId;

        $url = env('ENV') === 'production' ?
            SeuMiltoMapsConst::PRODUCTION_DOMAIN_URL :
            SeuMiltoMapsConst::SANDBOX_DOMAIN_URL;

        $this->api_url_milto_sms = $url . 'notifications/sms';

//        $this->api_url_milto_sms = 'http://host.docker.internal:8081/notifications/sms';
    }

    private function loadConfigs(): void
    {
        $miltoTokenApiNameSms = ExternalServiceMetaData::get('token_api_name_milto_service_sms', $this->cityId);
        $miltoTokenApiSms = ExternalServiceMetaData::get('token_api_milto_service_sms', $this->cityId);

        $this->token_name = $miltoTokenApiNameSms;
        $this->token = $miltoTokenApiSms;
    }

    public function getNumber(): string
    {
        return $this->number;
    }

    public function setNumber(string $number): MiltoServiceSmsApi
    {
        $this->number = $number;
        return $this;
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public function setMessage(string $message): MiltoServiceSmsApi
    {
        $this->message = $message;
        return $this;
    }

    public function getCityId(): ?int
    {
        return $this->cityId;
    }

    public function setCityId(int $cityId): MiltoServiceSmsApi
    {
        $this->cityId = $cityId;
        return $this;
    }

    public function send(string $number = '', string $message = ''): stdClass
    {
        $this->loadConfigs();

        $number = $this->getNumber();
        $message = $this->getMessage();

        $data = [
            'phone' => $number,
            'message' => $message
        ];

        $url = $this->getUrl();

        $result = $this->request($url, $data);

        $this->resultIsValid($result);

        return (object) $result;
    }

    private function request(string $url_request, array $data)
    {
        $ch = curl_init($url_request);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'token: ' . $this->token,
            'tokenname: ' . $this->token_name
        ]);

        $response = curl_exec($ch);

        curl_close($ch);

        return json_decode($response, true);
    }


    public function useBackup(bool $use = true): SmsApiInterface
    {
        $this->token = $use ? ExternalServiceMetaData::get('mex10_bkp_token', $this->getCityId()) : ExternalServiceMetaData::get('mex10_token', $this->getCityId());
        return $this;
    }


    /**
     * @param $result
     * @return bool
     * @throws Exception
     */
    private function resultIsValid($result)
    {
        if (!$result) {
            throw new Exception("Erro na comunicação com o seumilto: " . json_encode($result));
        }

        if (!$result['status']) {
            throw new Exception("Erro seumilto " . now() . ": {$result->message}");
        }

        return true;
    }

    private function getUrl()
    {
        return $this->api_url_milto_sms;
    }
    public function setParameters(array $data): SmsApiInterface
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key))
                $this->$key = $value;
        }

        return $this;
    }
}