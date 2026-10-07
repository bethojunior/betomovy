<?php

namespace app\contracts;

interface WhatsappInterface
{
    public function sendTextMessage(string $number, string $message): mixed;

    public function sendTextWithLink(string $number, string $title, string $message, string $thumb, string $link): mixed;

    public function sendTextWithFile(string $number, string $message): mixed;

    /**
     * deve retornar o nome do serviço integrado
     * ex: WhatsPlay.
     */
    public function getNameIntegration(): string;
}
