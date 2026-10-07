<?php

namespace app\utils;

use app\contracts\SmsInterface;
use Exception;

class SmsManager
{
    protected SmsInterface $api;

    public function __construct(SmsInterface $api)
    {
        $this->api = $api;
    }

    public function send(string $number, string $message): bool
    {
        try {
            $this->api->send($number, $message);

            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}
