<?php


namespace app\utils;

use app\constant\ExternalServiceTypeConst;
use app\constant\SeuMiltoMapsConst;
use app\contracts\SmsApiInterface;
use app\contracts\WhatsAppApiInterface;
use app\dao\DestinationDao;
use app\model\ExternalServiceMetaData;
use stdClass;
use Exception;

class MiltoServiceWhatsappApi
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
     * @var string $api_url_milto_whatsapp
     */
    private string $api_url_milto_whatsapp;

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

        $this->api_url_milto_whatsapp = $url . 'notifications/whatsapp';

//        $this->api_url_milto_whatsapp = 'http://host.docker.internal:8081/notifications/whatsapp';
    }

    private function loadConfigs(): void
    {
        $miltoTokenApiNameWhatsapp = ExternalServiceMetaData::get('token_api_name_milto_service_whatsapp', $this->cityId);
        $miltoTokenApiWhatsapp = ExternalServiceMetaData::get('token_api_milto_service_whatsapp', $this->cityId);

        $this->token_name = $miltoTokenApiNameWhatsapp;
        $this->token = $miltoTokenApiWhatsapp;
    }

    public function getNumber(): string
    {
        return $this->number;
    }

    public function setNumber(string $number): MiltoServiceWhatsappApi
    {
        $this->number = $number;
        return $this;
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public function setMessage(string $message): MiltoServiceWhatsappApi
    {
        $this->message = $message;
        return $this;
    }

    public function getCityId(): ?int
    {
        return $this->cityId;
    }

    public function setCityId(int $cityId): MiltoServiceWhatsappApi
    {
        $this->cityId = $cityId;
        return $this;
    }

    public function sendText($number, $message): array
    {
        $this->loadConfigs();

        $data = [
            'phone' => $number,
            'message' => $message
        ];

        $url = $this->getUrl();

        $result = $this->request($url, $data);

        $this->resultIsValid($result);

        return $result;
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
        return $this->api_url_milto_whatsapp;
    }
}