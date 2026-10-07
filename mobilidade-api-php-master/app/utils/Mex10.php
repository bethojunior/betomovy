<?php


namespace app\utils;

use app\contracts\SmsApiInterface;
use app\model\ExternalServiceMetaData;
use stdClass;

class Mex10 implements SmsApiInterface
{
    private $api_url = "https://mex10.com/api/shortcodev2.aspx";
    private $token;
    private $number;
    private $message;
    private $cityId;

    private const TOKEN = '7249607e993105d5100a795d441c993ed3c8762f7f7f2bb9c077086b98c3df0c';


    public function __construct(string $number = null, string $message = null, int $cityId = null, $isBackup = false)
    {
        $this->number = $number;
        $this->message = $message;
        $this->cityId = $cityId;

        $this->token = (!$isBackup ? ExternalServiceMetaData::get('mex10_token', $cityId) : ExternalServiceMetaData::get('mex10_bkp_token', $cityId)) ?? self::TOKEN;
    }

    public function getApiUrl(): string
    {
        return $this->api_url;
    }

    public function getNumber(): string
    {
        return $this->number;
    }

    public function setNumber(string $number): Mex10
    {
        $this->number = $number;
        return $this;
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public function setMessage(string $message): Mex10
    {
        $this->message = $message;
        return $this;
    }

    public function getCityId(): ?int
    {
        return $this->cityId;
    }

    public function setCityId(int $cityId): Mex10
    {
        $this->cityId = $cityId;
        return $this;
    }

    public function setToken(string $token): Mex10
    {
        $this->token = $token;
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
        $this->token = $use ? ExternalServiceMetaData::get('mex10_bkp_token', $this->getCityId()) : ExternalServiceMetaData::get('mex10_token', $this->getCityId());
        return $this;
    }

    public function send(string $number = '', string $message = ''): stdClass
    {
        if ($number) $this->number = $number;
        if ($message) $this->message = $message;

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $this->api_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);

        curl_setopt($ch, CURLOPT_POSTFIELDS, "token={$this->token}&t=send&n={$this->number}&m={$this->message}");

        $response = curl_exec($ch);
        curl_close($ch);

        $response = json_decode($response);

        return (object)[
            'status' => $response->data->success,
            'message' => $response->data->success ? 'ok' : 'error',
            'date' => $response->data->date,
            'errors' => $response->data->success ? null : (object)[
                'code' => null,
                'detailCode' => null,
                'message' => $response->errors->description,
                'service' => 'mex10'
            ]
        ];
    }
}