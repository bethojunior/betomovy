<?php

namespace App\Exceptions\Driver;

use App\Contracts\Exception\CustomException;

class DriverNotFoundException extends CustomException
{
    protected $message = 'Motorista não encontrado.';
}
