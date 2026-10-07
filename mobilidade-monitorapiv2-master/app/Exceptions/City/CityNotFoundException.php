<?php

namespace App\Exceptions\City;

use App\Contracts\Exception\CustomException;

class CityNotFoundException extends CustomException
{
    protected $message = 'Cidade não encontrada.';
}
