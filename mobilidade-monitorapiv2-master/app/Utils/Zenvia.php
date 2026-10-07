<?php


namespace App\Utils;


class Zenvia
{
    private $api_url = "https://api-rest.zenvia.com/services/send-sms";
    private $from;
    private $number;

    private $key_authorization;

    private $message;

    const AUTHORIZATION = "aGdjb3N0YS53ZWI6R3NDUmFSUzROOQ==";
    const BRAZIL_DDI = "55";

    const ZENVIA_ERROR_CODE = 10;

    public function __construct($number = null, $message = null, $from = null, $key = null)
    {
        $this->number = $number;
        $this->message = $message;

        $this->key_authorization = $key;

        if (!empty($from)) {
            $this->from = $from;
        } else {
            $iniFile = parse_ini_file('../configs/client/init.ini');
            $this->from = 'Teste';
        }
    }

    public function getApiUrl()
    {
        return $this->api_url;
    }

    public function getFrom()
    {
        return $this->from;
    }

    public function setFrom($from)
    {
        $this->from = $from;
    }

    public function getNumber()
    {
        return $this->number;
    }

    public function setNumber($number)
    {
        $this->number = $number;
    }

    public function getMessage()
    {
        return $this->message;
    }

    public function setMessage($message)
    {
        $this->message = $message;
    }

    /**
     * @param null $key_authorization
     * @return Zenvia
     */
    public function setKeyAuthorization($key_authorization)
    {
        $this->key_authorization = $key_authorization;
        return $this;
    }

    public function send()
    {
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
            "Authorization: Basic " . ($this->key_authorization ?? self::AUTHORIZATION),
            "Accept: application/json",
        ));

        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response);
    }
}
