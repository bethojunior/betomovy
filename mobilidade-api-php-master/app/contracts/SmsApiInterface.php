<?php


namespace app\contracts;
interface SmsApiInterface
{
    public function setParameters(array $data): SmsApiInterface;

    public function useBackup(bool $use = true): SmsApiInterface;

    public function send(string $number = '', string $message = '');
}