<?php

namespace app\utils;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/12/2018
 * Time: 08:05
 */
class NewaveSms
{
    private $api_base_url = "http://sms.newavetele.com/";
    private $from;
    private $number;
    private $message;

    private $callbackUrl;

    private $api_key;

    public function __construct($number = null, $message = null, $from = null)
    {
        $this->number = $number;
        $this->message = $message;

        $this->api_key = env("NEWAVE_API_KEY_SMS");
        $this->from = $from ?: env("NEWAVE_FROM_SMS");
    }

    /**
     * @return string
     */
    public function getApiBaseUrl(): string
    {
        return $this->api_base_url;
    }

    /**
     * @param string $api_base_url
     * @return NewaveSms
     */
    public function setApiBaseUrl(string $api_base_url): NewaveSms
    {
        $this->api_base_url = $api_base_url;
        return $this;
    }

    /**
     * @return null
     */
    public function getFrom()
    {
        return $this->from;
    }

    /**
     * @param null $from
     * @return NewaveSms
     */
    public function setFrom($from)
    {
        $this->from = $from;
        return $this;
    }

    /**
     * @return null
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * @param null $number
     * @return NewaveSms
     */
    public function setNumber($number)
    {
        $this->number = $number;
        return $this;
    }

    /**
     * @return null
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param null $message
     * @return NewaveSms
     */
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCallbackUrl()
    {
        return $this->callbackUrl;
    }

    /**
     * @param mixed $callbackUrl
     * @return NewaveSms
     */
    public function setCallbackUrl($callbackUrl)
    {
        $this->callbackUrl = $callbackUrl;
        return $this;
    }

    public function sendSms()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $this->getApiBaseUrl() . "api/v2/sms/");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['sendSmsRequest' => [
            'to' => $this->getNumber(),
            'message' => $this->from . ": " . $this->getMessage(),
//            'callbackUrl' => $this->callbackUrl,
        ]]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Content-Type: application/json",
            "Authorization: Basic " . $this->api_key,
            "Accept: application/json",
        ));

        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response);
    }
}