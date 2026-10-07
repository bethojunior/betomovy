<?php

namespace app\utils;

use app\contracts\SmsApiInterface;
use app\model\Config;
use app\model\ExternalServiceMetaData;

class Zenvia implements SmsApiInterface
{
    private $api_url = "https://api-rest.zenvia.com/services/send-sms";
    private $key;
    private $from;
    private $number;
    private $message;
    private $cityId;

    const ACCOUNT = "rodrigo.corp.api";
    const KEY = "PmtSWqWJDD";

    const ZENVIA_ERROR_CODE = 10;

    public function __construct(string $number = null, string $message = null, string $from = null, int $cityId = null, bool $isBackup = false)
    {
        $this->number = $number;
        $this->message = $message;
        $this->cityId = $cityId;

        $this->key = (!$isBackup ? base64_encode(ExternalServiceMetaData::get('zenvia_account', $cityId) . ":" . ExternalServiceMetaData::get('zenvia_key', $cityId)) :
                base64_encode(ExternalServiceMetaData::get('zenvia_bkp_account', $cityId) . ":" . ExternalServiceMetaData::get('zenvia_bkp_key', $cityId))) ??
            base64_encode(self::ACCOUNT . ":" . self::KEY);

        $this->from = $from ?? Config::get('app_title');
    }

    public function getApiUrl(): string
    {
        return $this->api_url;
    }

    public function getFrom(): string
    {
        return $this->from;
    }

    public function setFrom($from): Zenvia
    {
        $this->from = $from;
        return $this;
    }

    public function getNumber(): string
    {
        return $this->number;
    }

    public function setNumber($number): Zenvia
    {
        $this->number = $number;
        return $this;
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public function setMessage($message): Zenvia
    {
        $this->message = $message;
        return $this;
    }

    public function getCityId(): ?int
    {
        return $this->cityId;
    }

    public function setCityId(int $cityId): Zenvia
    {
        $this->cityId = $cityId;
        return $this;
    }

    public function setKey($key): Zenvia
    {
        $this->key = $key;
        return $this;
    }

    public function setParameters(array $data): SmsApiInterface
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key))
                $this->$key = $value;
        }

        return $this;
    }

    public function useBackup(bool $use = true): SmsApiInterface
    {
        $this->key = $use ? base64_encode(ExternalServiceMetaData::get('zenvia_bkp_account', $this->getCityId()) . ":" . ExternalServiceMetaData::get('zenvia_bkp_key', $this->getCityId())) :
            base64_encode(ExternalServiceMetaData::get('zenvia_account', $this->getCityId()) . ":" . ExternalServiceMetaData::get('zenvia_key', $this->getCityId()));
        return $this;
    }

    public function send(string $number = '', string $message = '')
    {
        if ($number) $this->number = $number;
        if ($message) $this->message = $message;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $this->getApiUrl());
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['sendSmsRequest' => [
            'from' => $this->getFrom(),
            'to' => $this->getNumber(),
            'msg' => $this->getMessage(),
            'callbackOption' => "NONE",
        ]]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Content-Type: application/json",
            "Authorization: Basic " . ($this->key ?? base64_encode(self::ACCOUNT . ":" . self::KEY)),
            "Accept: application/json",
        ));

        $response = curl_exec($ch);
        curl_close($ch);

        $response = json_decode($response);

        if (!$response) {
            return (object)[
                'status' => false,
                'message' => "Check your credentials",
                'date' => null,
                'errors' => (object)[
                    'code' => null,
                    'detailCode' => null,
                    'message' => null,
                    'service' => 'zenvia'
                ]
            ];
        }

        return (object)[
            'status' => (int)$response->sendSmsResponse->statusCode <= 3,
            'message' => $response->sendSmsResponse->statusDescription,
            'date' => null,
            'errors' => $response->sendSmsResponse->statusCode <= 3 ? null : (object)[
                'code' => $response->sendSmsResponse->statusCode,
                'detailCode' => $response->sendSmsResponse->detailCode,
                'message' => $response->sendSmsResponse->detailDescription,
                'service' => 'zenvia'
            ]
        ];
    }
}