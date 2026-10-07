<?php

namespace app\contracts;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/03/2020
 * Time: 10:19
 */
interface WhatsAppApiInterface
{
    public function getExternalServiceId(): int;
}