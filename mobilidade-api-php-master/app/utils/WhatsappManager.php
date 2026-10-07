<?php

namespace app\utils;

use app\contracts\WhatsappInterface;
use App\Utils\Comunication\Interfaces\IApiWhatsapp;
use Throwable;

class WhatsappManager
{
    protected $api;

    public function __construct($api)
    {
        $this->api = $api;
    }

    public function sendTextMessage(string $number, string $message): bool
    {

        try {
            $this->api->sendTextMessage($number, $message);
        } catch (Throwable $th) {
            return false;
        }

        return true;
    }

    public function sendTextWithLink(string $number, string $title, string $message, $thumb, $link): bool
    {
        try {
            $this->api->sendTextWithLink(
                $number, $title, $message, $thumb, $link
            );
        } catch (Throwable $th) {
            return false;
        }

        return true;
    }
}
