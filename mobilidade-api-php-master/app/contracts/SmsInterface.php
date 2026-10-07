<?php

namespace app\contracts;

interface SmsInterface
{
    public function send(string $number, string $message): array;
}
