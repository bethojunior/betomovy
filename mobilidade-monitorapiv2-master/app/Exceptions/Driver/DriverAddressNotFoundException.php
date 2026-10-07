<?php

namespace App\Exceptions\Driver;

use App\Contracts\Exception\CustomException;

class DriverAddressNotFoundException extends CustomException
{
    protected $message = 'O endereço do motorista não foi encontrado. Tente cadastrar um endereço.';
}
