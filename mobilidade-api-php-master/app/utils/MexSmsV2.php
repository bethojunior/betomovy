<?php

namespace app\utils;

use app\contracts\SmsInterface;
use App\Utils\Comunication\Interfaces\IApiSms;

class MexSmsV2 implements SmsInterface
{
    protected string $token;
    protected string $baseUrl;
    protected string $url;
    protected array $headers;

    public function __construct(string $url, string $token)
    {
        $this->token = $token;
        $this->baseUrl = $url;
        $this->url = $url;
    }

    private function builderRequest(string $number, string $message): string
    {
        return $this->url =
            $this->url."?token=$this->token&t=send&n=$number&m=$message";
    }

    public function send(string $number, string $message): array
    {
        $url = $this->builderRequest($number, $message);
        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $this->baseUrl.'?token='.$this->token);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADER, false);

            curl_setopt($ch, CURLOPT_POSTFIELDS, $url);

            $response = curl_exec($ch);
            curl_close($ch);

            $response = json_decode($response, true);

            if ($response['errors']['error']) {
                throw new \Exception($response['errors']['description']);
            }

            return ['response' => $response];
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
