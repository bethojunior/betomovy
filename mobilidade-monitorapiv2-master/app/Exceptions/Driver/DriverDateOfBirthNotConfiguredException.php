<?php

namespace App\Exceptions\Driver;

use App\Contracts\Exception\CustomException;

class DriverDateOfBirthNotConfiguredException extends CustomException
{
    protected $message =
        'A data de nascimento do motorista não está configurada. Registre a data de nascimento do motorista e tente novamente.';
}
